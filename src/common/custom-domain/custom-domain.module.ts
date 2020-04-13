import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CustomDomainIndexComponent} from '@common/custom-domain/custom-domain-index/custom-domain-index.component';
import {CrupdateCustomDomainModalComponent} from '@common/custom-domain/crupdate-custom-domain-modal/crupdate-custom-domain-modal.component';
import {UiModule} from '@common/core/ui/ui.module';
import {DataTableModule} from '@common/shared/data-table/data-table.module';
import {MatDialogModule, MatSlideToggleModule} from '@angular/material';

@NgModule({
    declarations: [
        CustomDomainIndexComponent,
        CrupdateCustomDomainModalComponent,
    ],
    imports: [
        CommonModule,
        UiModule,
        DataTableModule,
        MatDialogModule,
        MatSlideToggleModule,
    ],
    entryComponents: [
        CrupdateCustomDomainModalComponent,
    ],
    exports: [
        CustomDomainIndexComponent,
        CrupdateCustomDomainModalComponent
    ]
})
export class CustomDomainModule {
}
