import {Injectable} from '@angular/core';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot, Router } from '@angular/router';
import { catchError, mergeMap } from 'rxjs/operators';
import {EMPTY, Observable, of} from 'rxjs';
import {Store} from '@ngxs/store';
import {HydrateTitle} from './state/crupdate-title-actions';

@Injectable({
    providedIn: 'root'
})
export class CrupdateTitleResolverService implements Resolve<Observable<any>> {
    constructor(
        private router: Router,
        private store: Store,
    ) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        return this.store.dispatch(new HydrateTitle(+route.params.id)).pipe(
            catchError(() => {
                this.router.navigate(['/admin/titles']);
                return EMPTY;
            }),
            mergeMap(response => {
                if (response) {
                    return of(response);
                } else {
                    this.router.navigate(['/admin/titles']);
                    return EMPTY;
                }
            })
        );
    }
}

