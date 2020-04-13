import {Injectable} from '@angular/core';
import {NavigationCancel, NavigationStart, Router} from '@angular/router';
import {filter} from 'rxjs/operators';
import {Store} from '@ngxs/store';
import {ToggleGlobalLoader} from '../../state/app-state-actions';
import {stringsMatch} from '../../../common/core/utils/strings-match';

@Injectable({
    providedIn: 'root'
})
export class GlobalLoaderHandlerService {
    private triggerPatterns = [
        '/titles/*',
        '/titles/*/full-credits',
        '/titles/*/season/*',
        '/titles/*/season/*/episode/*',
        '/people/*',
        '/search?query=*',
    ];

    constructor(
        private router: Router,
        private store: Store,
    ) {
        this.init();
    }

    private init() {
        this.router.events
            .pipe(filter(e => e instanceof NavigationStart || e instanceof NavigationCancel))
            .subscribe((e: NavigationStart|NavigationCancel) => {
                if (e instanceof NavigationStart) {
                    const matched = this.triggerPatterns.some(pattern => {
                        return stringsMatch(pattern, e.url);
                    });

                    if (matched) {
                        this.store.dispatch(new ToggleGlobalLoader(true));
                    } else {
                        this.store.dispatch(new ToggleGlobalLoader(false));
                    }
                } else {
                    this.store.dispatch(new ToggleGlobalLoader(false));
                }
            });
    }
}
