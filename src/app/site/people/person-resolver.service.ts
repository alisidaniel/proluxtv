import { Injectable } from '@angular/core';
import {Resolve, ActivatedRouteSnapshot, Router} from '@angular/router';
import {Store} from '@ngxs/store';
import {Observable, of} from 'rxjs';
import {LoadPerson} from './state/person-state-actions';
import {catchError, mergeMap} from 'rxjs/operators';
import {PersonStateModel} from './state/person-state';
import {MetaTag} from '@common/core/meta/meta-tags.service';

@Injectable({
    providedIn: 'root',
})
export class PersonResolverService implements Resolve<{seo: MetaTag[]}> {
    constructor(
        private store: Store,
        private router: Router,
    ) {}

    resolve(route: ActivatedRouteSnapshot): Observable<{seo: MetaTag[]}> {
        return this.store.dispatch(new LoadPerson(+route.params.id))
            .pipe(
                catchError(() => {
                    this.router.navigateByUrl('/');
                    return of(null);
                }),
                mergeMap((store: {person: PersonStateModel}) => {
                    return of({seo: store.person.metaTags});
                })
            );
    }
}
