import { Injectable } from '@angular/core';
import {Resolve, ActivatedRouteSnapshot, Router} from '@angular/router';
import {LoadTitle} from './state/title-actions';
import {Store} from '@ngxs/store';
import {EMPTY, Observable, of} from 'rxjs';
import {catchError, mergeMap} from 'rxjs/operators';
import {TitleStateModel} from './state/title-state-model';
import {MetaTag} from '../../../common/core/meta/meta-tags.service';

@Injectable({
    providedIn: 'root',
})
export class TitleResolverService implements Resolve<{seo: MetaTag[]}> {
    constructor(
        private store: Store,
        private router: Router,
    ) {}

    resolve(route: ActivatedRouteSnapshot): Observable<{seo: MetaTag[]}> {
        const params = {...route.params};
        if (route.data.fullCredits) params.fullCredits = true;
        return this.store.dispatch(new LoadTitle(params.titleId, params))
            .pipe(
                catchError(() => {
                    this.router.navigateByUrl('/');
                    return EMPTY;
                }),
                mergeMap((store: {title: TitleStateModel}) => {
                    return of({seo: store.title.metaTags});
                })
            );
    }
}
