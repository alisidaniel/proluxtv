import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Settings} from '@common/core/config/settings.service';
import {CurrentUser} from '@common/auth/current-user';
import {ToggleGlobalLoader} from '../../../state/app-state-actions';
import {Store} from '@ngxs/store';

@Component({
    selector: 'homepage-host',
    templateUrl: './homepage-host.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomepageHostComponent implements OnInit {
    constructor(
        public settings: Settings,
        public currentUser: CurrentUser,
        private store: Store,
    ) {}

    ngOnInit() {
        setTimeout(() => this.store.dispatch(new ToggleGlobalLoader(false)));
    }
}
