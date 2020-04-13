import {ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {TitleState} from '../state/title-state';
import {Observable} from 'rxjs';
import {Title} from '../../../models/title';
import {ToggleGlobalLoader} from '../../../state/app-state-actions';
import {Settings} from '../../../../common/core/config/settings.service';
import {Image} from '../../../models/image';
import {OverlayPanel} from '../../../../common/core/ui/overlay-panel/overlay-panel.service';
import {ImageGalleryOverlayComponent} from '../../shared/image-gallery-overlay/image-gallery-overlay.component';
import {ViewportScroller} from '@angular/common';
import {ActivatedRoute} from '@angular/router';

@Component({
    selector: 'title-page-container',
    templateUrl: './title-page-container.component.html',
    styleUrls: ['./title-page-container.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class TitlePageContainerComponent implements OnInit {
    @Select(TitleState.title) title$: Observable<Title>;
    @Select(TitleState.backdrop) backdropImage$: Observable<string>;

    constructor(
        private store: Store,
        public settings: Settings,
        private overlay: OverlayPanel,
        private route: ActivatedRoute,
        private viewportScroller: ViewportScroller,
    ) {}

    ngOnInit() {
        // scroll to top when title changes as
        // component will be re-used by angular
        this.route.params.subscribe(() => {
            this.viewportScroller.scrollToPosition([0, 0]);
            setTimeout(() => this.store.dispatch(new ToggleGlobalLoader(false)));
        });
    }

    public openImageGallery(images: Image[], currentImage: Image) {
        this.overlay.open(ImageGalleryOverlayComponent, {
            origin: 'global',
            position: 'center',
            panelClass: 'image-gallery-overlay-container',
            backdropClass: 'image-gallery-overlay-backdrop',
            hasBackdrop: true,
            data: {images, currentImage}
        });
    }
}
