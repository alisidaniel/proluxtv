import {Component, ViewEncapsulation, ChangeDetectionStrategy} from '@angular/core';
import {TitleState} from '../../state/title-state';
import {Select, Store} from '@ngxs/store';
import {Observable, zip} from 'rxjs';
import {Episode} from '../../../../models/episode';
import {TitleUrlsService} from '../../title-urls.service';

@Component({
    selector: 'current-next-episode-panel',
    templateUrl: './current-next-episode-panel.component.html',
    styleUrls: ['./current-next-episode-panel.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CurrentNextEpisodePanelComponent {
    @Select(TitleState.nextEpisode) nextEpisode$: Observable<Episode>;
    @Select(TitleState.currentEpisode) currentEpisode$: Observable<Episode>;

    get episodes$(): Observable<Episode[]> {
        return zip(
            this.currentEpisode$,
            this.nextEpisode$,
        );
    }

    constructor(
        private urls: TitleUrlsService,
        private store: Store,
    ) {}

    public getEpisodeUrl(episode: Episode) {
        const series = this.store.selectSnapshot(TitleState.title);
        return this.urls.episode(series, episode.season_number, episode.episode_number);
    }
}
