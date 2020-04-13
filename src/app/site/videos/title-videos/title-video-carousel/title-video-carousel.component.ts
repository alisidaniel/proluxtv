import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {TitleState} from '../../../titles/state/title-state';
import {Observable} from 'rxjs';
import {Video} from '../../../../models/video';
import {getFaviconFromUrl} from '@common/core/utils/get-favicon-from-url';
import {PlayVideo} from '../../../player/state/player-state-actions';
import {Episode} from '../../../../models/episode';
import {Title} from '../../../../models/title';

@Component({
    selector: 'title-video-carousel',
    templateUrl: './title-video-carousel.component.html',
    styleUrls: ['./title-video-carousel.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TitleVideoCarouselComponent {
    @Select(TitleState.loading) loading$: Observable<boolean>;
    @Select(TitleState.videos) videos$: Observable<Video[]>;
    private readonly mediaItem: Episode | Title;

    constructor(private store: Store) {
        this.mediaItem = this.store.selectSnapshot(TitleState.titleOrEpisode);
    }

    public getThumbnail(video: Video) {
        return video.thumbnail || this.mediaItem['backdrop'] || this.mediaItem.poster;
    }

    public playVideo(video: Video) {
        if (video.type === 'external') {
            window.open(video.url, '_blank');
        } else {
            this.store.dispatch(new PlayVideo(video, this.mediaItem));
        }
    }

    public getFavicon(url: string): string {
        return getFaviconFromUrl(url);
    }
}
