import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PlayerComponent} from './player/player.component';
import {PlayerOverlayHandler} from './state/player-overlay-handler';
import {NgxsModule} from '@ngxs/store';
import {PlayerState} from './state/player-state';
import {MatButtonModule, MatIconModule, MatSidenavModule} from '@angular/material';
import {TranslationsModule} from '@common/core/translations/translations.module';
import {LoadingIndicatorModule} from '@common/core/ui/loading-indicator/loading-indicator.module';
import {MediaImageModule} from '../shared/media-image/media-image.module';

@NgModule({
    declarations: [
        PlayerComponent,
    ],
    imports: [
        CommonModule,

        MatSidenavModule,
        MatIconModule,
        MatButtonModule,
        TranslationsModule,
        LoadingIndicatorModule,
        MediaImageModule,

        NgxsModule.forFeature([
            PlayerState,
        ]),
    ],
    entryComponents: [
        PlayerComponent,
    ]
})
export class PlayerModule {
    constructor(
        private overlayHandler: PlayerOverlayHandler,
    ) {}
}
