import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Video} from '../../../../models/video';
import {RateVideo} from '../../../titles/state/title-actions';
import {Select, Store} from '@ngxs/store';
import {TitleState} from '../../../titles/state/title-state';
import {Observable} from 'rxjs';

@Component({
    selector: 'video-rating-widget',
    templateUrl: './video-rating-widget.component.html',
    styleUrls: ['./video-rating-widget.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class VideoRatingWidgetComponent {
    @Select(TitleState.loading) loading$: Observable<boolean>;
    @Input() video: Video;

    constructor(private store: Store) {}

    public rateVideo(video: Video, rating: 'positive' | 'negative') {
        this.store.dispatch(new RateVideo(video, rating));
    }
}
