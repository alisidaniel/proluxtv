import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MediaImageComponent} from './media-image.component';
import {RouterModule} from '@angular/router';
import {intersectionObserverPreset, LazyLoadImageModule} from 'ng-lazyload-image';

@NgModule({
    declarations: [
        MediaImageComponent,
    ],
    imports: [
        CommonModule,
        RouterModule,
        LazyLoadImageModule.forRoot({
            preset: intersectionObserverPreset
        }),
    ],
    exports: [
        MediaImageComponent,
    ]
})
export class MediaImageModule {
}
