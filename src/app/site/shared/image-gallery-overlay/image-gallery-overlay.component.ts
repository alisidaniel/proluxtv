import {Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, Inject, Optional} from '@angular/core';
import {OVERLAY_PANEL_DATA} from '../../../../common/core/ui/overlay-panel/overlay-panel-data';
import {OverlayPanelRef} from '../../../../common/core/ui/overlay-panel/overlay-panel-ref';
import {Image} from '../../../models/image';

interface ImageGalleryOverlayData {
    currentImage?: Image;
    images: Image[];
}

@Component({
    selector: 'image-gallery-overlay',
    templateUrl: './image-gallery-overlay.component.html',
    styleUrls: ['./image-gallery-overlay.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageGalleryOverlayComponent implements OnInit {
    constructor(
        @Inject(OVERLAY_PANEL_DATA) @Optional() public data: ImageGalleryOverlayData,
        private overlayPanelRef: OverlayPanelRef,
    ) {
    }

    ngOnInit() {
    }

    public close() {
        this.overlayPanelRef.close();
    }
}
