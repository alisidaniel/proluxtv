import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {BehaviorSubject, Observable, of, ReplaySubject, Subscription} from 'rxjs';
import {map, switchMap, take, tap} from 'rxjs/operators';
import {PaginationResponse} from '@common/core/types/pagination/pagination-response';
import {AppHttpClient} from '@common/core/http/app-http-client.service';
import {PaginatedBackendResponse} from '@common/core/types/pagination/paginated-backend-response';

export const DEFAULT_PAGINATOR_PARAMS = {
    order_by: 'updated_at',
    order_dir: <'asc'|'desc'>'desc',
    page: 1,
    per_page: 15,
};

@Injectable({
    providedIn: 'root',
})
export class Paginator<T> {
    protected params$ = new BehaviorSubject(DEFAULT_PAGINATOR_PARAMS);
    private backendUri: string;
    private lastResponse$ = new ReplaySubject<PaginationResponse<T>>(1);
    private subscription: Subscription;
    private initiated = false;
    private paginatedOnce = false;

    // might not want to update query params sometimes
    // if data table is only smaller part of the page
    public dontUpdateQueryParams = false;
    public loading$ = new BehaviorSubject(false);

    public get pagination$(): Observable<PaginationResponse<T>> {
        return this.lastResponse$.asObservable();
    }

    public get noResults$() {
        // only return TRUE if data has already been
        // loaded from backend and there were no results
        return this.pagination$.pipe(map(p => !!p.data && p.data.length === 0));
    }

    constructor(
        private router: Router,
        private http: AppHttpClient,
    ) {}

    public paginate(userParams: object = {}, url?: string, initialData?: PaginationResponse<T>): Observable<PaginationResponse<T>> {
        const queryParams = this.router.routerState.root.snapshot.queryParams;
        this.params$.next({...DEFAULT_PAGINATOR_PARAMS, ...queryParams, ...userParams});

        if ( ! this.initiated) {
            this.init(url, initialData);
        }

        // prevent multiple subscriptions
        return this.pagination$.pipe(take(1));
    }

    private init(uri: string, initialData?: PaginationResponse<T>) {
        this.backendUri = uri;
        this.subscription = this.params$.pipe(
            switchMap(params => {
                this.loading$.next(true);

                // if we got initial pagination response (of 1st page)
                // return that instead of making 1st page http request
                const request = !this.paginatedOnce && initialData ?
                    of({pagination: initialData}) :
                    this.http.get(this.backendUri, params);

                return request.pipe(
                    // can't use "finalize" here as it will complete after loading$.next(true)
                    // call above, which will prevent loading bar from showing
                    // if pagination request is cancelled and new one is queued
                    tap(() => {
                        this.updateQueryParams(params);
                        this.loading$.next(false);
                        this.paginatedOnce = true;
                    }, () => {
                        this.loading$.next(false);
                        this.paginatedOnce = true;
                    })
                ) as PaginatedBackendResponse<T>;
            })
        ).subscribe(response => {
            this.lastResponse$.next(response.pagination);
        });

        this.initiated = true;
    }

    /**
     * Update query params of currently active url.
     */
    private updateQueryParams(params = {}) {
        if (this.dontUpdateQueryParams) return;
        const defaults = DEFAULT_PAGINATOR_PARAMS;
        // there's no need to reflect default
        // or non-common params in query, filter them out
        const filtered = Object.keys(params)
            .filter(key => defaults[key] && params[key] !== defaults[key])
            .reduce((obj, key) => {
                obj[key] = params[key];
                return obj;
            }, {});
        this.router.navigate([], {queryParams: filtered, replaceUrl: true});
    }

    public destroy() {
        this.subscription && this.subscription.unsubscribe();
    }
}
