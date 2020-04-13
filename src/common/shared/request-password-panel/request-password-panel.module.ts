import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RequestPasswordPanelComponent} from '@common/shared/request-password-panel/request-password-panel.component';
import {MatButtonModule, MatIconModule} from '@angular/material';
import {TranslationsModule} from '@common/core/translations/translations.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@NgModule({
    declarations: [
        RequestPasswordPanelComponent,
    ],
    imports: [
        CommonModule,

        MatButtonModule,
        MatIconModule,
        TranslationsModule,
        ReactiveFormsModule,
        FormsModule,
    ],
    exports: [
        RequestPasswordPanelComponent,
    ]
})
export class RequestPasswordPanelModule {
}
