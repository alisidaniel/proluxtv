import {ChangeDetectionStrategy, Component, HostBinding, Input, ViewEncapsulation,} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {TitleState} from '../../state/title-state';
import {Observable} from 'rxjs';
import {Video} from '../../../../models/video';
import {PlayVideo} from '../../../player/state/player-state-actions';
import {Settings} from '@common/core/config/settings.service';

@Component({
    selector: 'media-item-header',
    templateUrl: './media-item-header.component.html',
    styleUrls: ['./media-item-header.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MediaItemHeaderComponent {
    @Select(TitleState.primaryVideo) primaryVideo$: Observable<Video>;

    @Input() backdrop: string;
    @Input() transparent = false;

    constructor(
        private store: Store,
        public settings: Settings,
    ) {}

    @HostBinding('style.background-image') get backgroundImage() {
        if (this.backdrop) {
            return 'url(' + this.backdrop + ')';
        }
    }

    @HostBinding('class.no-backdrop') get noBackdrop() {
        if ( ! this.backdrop) {
            return 'no-backdrop';
        }
    }

    public playVideo(video: Video) {
        const title = this.store.selectSnapshot(TitleState.title);
        this.store.dispatch(new PlayVideo(video, title));
    }
}
