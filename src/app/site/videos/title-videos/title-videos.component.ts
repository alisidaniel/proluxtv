import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CrupdateVideoModalComponent} from '../crupdate-video-modal/crupdate-video-modal.component';
import {Select, Store} from '@ngxs/store';
import {BehaviorSubject, Observable} from 'rxjs';
import {CurrentUser} from '@common/auth/current-user';
import {AddVideo} from '../../titles/state/title-actions';
import {Modal} from '@common/core/ui/dialogs/modal.service';
import {TitleState} from '../../titles/state/title-state';
import {Settings} from '@common/core/config/settings.service';
import {Title} from '../../../models/title';
import {Season} from '../../../models/season';
import {Episode} from '../../../models/episode';
import {MEDIA_TYPE} from '../../media-type';

@Component({
    selector: 'title-videos',
    templateUrl: './title-videos.component.html',
    styleUrls: ['./title-videos.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TitleVideosComponent {
    public loading$ = new BehaviorSubject(false);
    @Select(TitleState.titleOrEpisode) title$: Observable<Title|Episode>;
    @Select(TitleState.seasons) seasons$: Observable<Season[]>;

    constructor(
        private modal: Modal,
        private store: Store,
        public currentUser: CurrentUser,
        public settings: Settings,
    ) {}

    public openAddVideoModal() {
        const episode = this.store.selectSnapshot(TitleState.episode),
            title = this.store.selectSnapshot(TitleState.title);
        this.modal.open(
            CrupdateVideoModalComponent,
            // title should not be changeable when adding video from any specific title pages and
            // season/episode should not be changeable when adding video from specific episode page
            {
                title,
                hideTitleSelect: true,
                hideEpisodeSelect: !!episode,
                episode: episode ? episode.episode_number : null,
                season: episode ? episode.season_number : null,
            },
        ).beforeClosed().subscribe(video => {
            if ( ! video) return;
            this.store.dispatch(new AddVideo(video));
        });
    }

    public isSeries(title: Title | Episode): boolean {
        return title.type === MEDIA_TYPE.TITLE && title.is_series;
    }
}
