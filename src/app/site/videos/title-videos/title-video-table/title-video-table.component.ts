import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Video} from '../../../../models/video';
import {Select, Store} from '@ngxs/store';
import {TitleState} from '../../../titles/state/title-state';
import {Observable} from 'rxjs';
import {getFaviconFromUrl} from '@common/core/utils/get-favicon-from-url';
import {ReportVideo} from '../../../titles/state/title-actions';
import {PlayVideo} from '../../../player/state/player-state-actions';

@Component({
    selector: 'title-video-table',
    templateUrl: './title-video-table.component.html',
    styleUrls: ['./title-video-table.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TitleVideoTableComponent {
    @Select(TitleState.loading) loading$: Observable<boolean>;
    @Select(TitleState.videos) videos$: Observable<Video[]>;

    constructor(private store: Store) {}

    public playVideo(video: Video) {
        const mediaItem = this.store.selectSnapshot(TitleState.titleOrEpisode);
        if (video.type === 'external') {
            window.open(video.url, '_blank');
        } else {
            this.store.dispatch(new PlayVideo(video, mediaItem));
        }
    }

    public getFavicon(url: string): string {
        return getFaviconFromUrl(url);
    }

    public reportVideo(video: Video) {
        this.store.dispatch(new ReportVideo(video));
    }
}
