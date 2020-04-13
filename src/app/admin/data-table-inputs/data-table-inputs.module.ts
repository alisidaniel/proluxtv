import {NgModule} from '@angular/core';
import {MatButtonModule, MatIconModule, MatMenuModule} from '@angular/material';
import {CommonModule} from '@angular/common';
import {TranslationsModule} from '@common/core/translations/translations.module';
import {ReactiveFormsModule} from '@angular/forms';
import {LoadingIndicatorModule} from '@common/core/ui/loading-indicator/loading-indicator.module';
import {AppDataTableInputsComponent} from './app-data-table-inputs/app-data-table-inputs.component';
import {SelectTitleInputComponent} from '../video-index/select-title-input/select-title-input.component';

@NgModule({
    declarations: [
        SelectTitleInputComponent,
        AppDataTableInputsComponent,
    ],
    imports: [
        CommonModule,
        MatMenuModule,
        TranslationsModule,
        ReactiveFormsModule,
        MatIconModule,
        MatButtonModule,
        LoadingIndicatorModule,
    ],
    exports: [
        AppDataTableInputsComponent,
        SelectTitleInputComponent,
    ],
    entryComponents: [
        SelectTitleInputComponent,
    ],
})
export class DataTableInputsModule {
}
