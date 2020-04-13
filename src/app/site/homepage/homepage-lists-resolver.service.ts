import {Injectable} from '@angular/core';
import {Resolve, ActivatedRouteSnapshot} from '@angular/router';
import {Store} from '@ngxs/store';
import {EMPTY, Observable, of} from 'rxjs';
import {LoadLists} from './state/homepage-state.actions';
import {ToggleGlobalLoader} from '../../state/app-state-actions';
import {catchError, mergeMap} from 'rxjs/operators';
import {TitleStateModel} from '../titles/state/title-state-model';
import {HomepageStateModel} from './state/homepage-state';
import {MetaTag} from '../../../common/core/meta/meta-tags.service';

@Injectable({
    providedIn: 'root',
})
export class HomepageListsResolverService implements Resolve<{seo: MetaTag[]}> {
    constructor(private store: Store) {}

    resolve(route: ActivatedRouteSnapshot): Observable<{seo: MetaTag[]}> {
        return this.store.dispatch([
            new LoadLists(),
            new ToggleGlobalLoader(true),
        ]).pipe(
            catchError(() => {
                return EMPTY;
            }),
            mergeMap((states: {homepage: HomepageStateModel}[]) => {
                return of({seo: states[0].homepage.metaTags});
            })
        );
    }
}
