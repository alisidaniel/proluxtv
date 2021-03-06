import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ImageZoomComponent} from './image-zoom.component';
import { ImageZoomOverlayComponent } from './image-zoom-overlay/image-zoom-overlay.component';
import {MatButtonModule, MatIconModule} from '@angular/material';

@NgModule({
    declarations: [ImageZoomComponent, ImageZoomOverlayComponent],
    imports: [
        CommonModule,
        MatButtonModule,
        MatIconModule,
    ],
    entryComponents: [
        ImageZoomOverlayComponent,
    ],
    exports: [
        ImageZoomComponent,
    ]
})
export class ImageZoomModule {
}
