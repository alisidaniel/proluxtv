import {ChangeDetectionStrategy, Component, HostBinding, Input, ViewChild} from '@angular/core';
import {Video} from '../../../../models/video';
import {DeleteVideo, UpdateVideo} from '../../../titles/state/title-actions';
import {Select, Store} from '@ngxs/store';
import {CurrentUser} from '@common/auth/current-user';
import {TitleState} from '../../../titles/state/title-state';
import {Observable} from 'rxjs';
import {CrupdateVideoModalComponent} from '../../crupdate-video-modal/crupdate-video-modal.component';
import {Modal} from '@common/core/ui/dialogs/modal.service';

@Component({
    selector: 'edit-title-video-widget',
    templateUrl: './edit-title-video-widget.component.html',
    styleUrls: ['./edit-title-video-widget.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditTitleVideoWidgetComponent  {
    @Select(TitleState.loading) loading$: Observable<boolean>;
    @Input() video: Video;
    @HostBinding('class.hidden') get shouldShow() {
        return !this.canDeleteVideo() && !this.canEditVideo();
    }

    constructor(
        private store: Store,
        private currentUser: CurrentUser,
        private modal: Modal,
    ) {}

    public deleteVideo() {
        this.store.dispatch(new DeleteVideo(this.video));
    }

    public canDeleteVideo() {
        return this.video.user_id === this.currentUser.get('id') ||
            this.currentUser.hasPermission('videos.delete');
    }

    public canEditVideo() {
        return this.video.user_id === this.currentUser.get('id') ||
            this.currentUser.hasPermission('videos.update');
    }

    public openEditModal() {
        const episode = this.store.selectSnapshot(TitleState.episode),
            title = this.store.selectSnapshot(TitleState.title);
        this.modal.open(
            CrupdateVideoModalComponent,
            // title should not be changeable when adding video from any specific title pages and
            // season/episode should not be changeable when adding video from specific episode page
            {
                video: this.video,
                title,
                hideTitleSelect: true,
                hideEpisodeSelect: !!episode,
                episode: episode ? episode.episode_number : null,
                season: episode ? episode.season_number : null,
            },
        ).beforeClosed().subscribe(newVideo => {
            if ( ! newVideo) return;
            this.store.dispatch(new UpdateVideo(newVideo));
        });
    }
}
