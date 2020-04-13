import { Injectable } from '@angular/core';
import {Resolve, ActivatedRouteSnapshot, Router} from '@angular/router';
import {Store} from '@ngxs/store';
import {Observable} from 'rxjs';
import {SearchEverything} from '../state/search-state-actions';

@Injectable({
    providedIn: 'root',
})
export class SearchResultsResolverService implements Resolve<void|boolean> {
    constructor(
        private store: Store,
        private router: Router,
    ) {}

    resolve(route: ActivatedRouteSnapshot): Observable<void>|Promise<boolean> {
        if (route.queryParams.query) {
            return this.store.dispatch(new SearchEverything(route.queryParams.query, null, 20));
        } else {
            return this.router.navigate(['/']);
        }
    }
}
