import {Component, ViewEncapsulation, ChangeDetectionStrategy, OnInit} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {TitleState} from '../../state/title-state';
import {Observable} from 'rxjs';
import {Episode} from '../../../../models/episode';
import {ToggleGlobalLoader} from '../../../../state/app-state-actions';
import {Settings} from '../../../../../common/core/config/settings.service';

@Component({
    selector: 'episode-page',
    templateUrl: './episode-page.component.html',
    styleUrls: ['./episode-page.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EpisodePageComponent implements OnInit {
    @Select(TitleState.episode) episode$: Observable<Episode>;
    @Select(TitleState.backdrop) backdropImage$: Observable<string>;

    constructor(
        private store: Store,
        public settings: Settings,
    ) {}

    ngOnInit() {
        // TODO: remove settimout
        setTimeout(() => {
            this.store.dispatch(new ToggleGlobalLoader(false));
        });
    }
}
