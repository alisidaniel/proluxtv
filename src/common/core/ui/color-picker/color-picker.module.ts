import {NgModule} from '@angular/core';
import {ColorpickerPanelComponent} from './colorpicker-panel.component';
import {ColorPickerModule as NgxColorPickerModule} from 'ngx-color-picker';
import {OverlayModule} from '@angular/cdk/overlay';
import { ColorPickerInputComponent } from './color-picker-input/color-picker-input.component';
import {MatIconModule} from '@angular/material';
import {TranslationsModule} from '@common/core/translations/translations.module';
import {OverlayPanel} from '@common/core/ui/overlay-panel/overlay-panel.service';
import {CommonModule} from '@angular/common';

@NgModule({
    imports: [
        CommonModule,
        NgxColorPickerModule,
        OverlayModule,

        MatIconModule,
        TranslationsModule,
    ],
    declarations: [
        ColorpickerPanelComponent,
        ColorPickerInputComponent,
    ],
    entryComponents: [
        ColorpickerPanelComponent,
    ],
    exports: [
        ColorpickerPanelComponent,
        ColorPickerInputComponent,
    ],
    providers: [
        OverlayPanel,
    ]
})
export class ColorPickerModule {
}
