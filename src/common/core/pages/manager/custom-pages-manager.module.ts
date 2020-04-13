import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UiModule} from '@common/core/ui/ui.module';
import {CustomPagesIndexComponent} from '@common/core/pages/manager/custom-pages-index/custom-pages-index.component';
import {CrupdatePageComponent} from '@common/core/pages/manager/crupdate-page/crupdate-page.component';
import {DataTableModule} from '@common/shared/data-table/data-table.module';
import {RouterModule} from '@angular/router';
import {TextEditorModule} from '@common/text-editor/text-editor.module';
import {CUSTOM_PAGE_CONFIG_TOKEN, CustomPageManagerConfig} from '@common/core/pages/manager/custom-page-config';

@NgModule({
    declarations: [
        CustomPagesIndexComponent,
        CrupdatePageComponent,
    ],
    imports: [
        CommonModule,
        RouterModule,
        UiModule,
        DataTableModule,
        TextEditorModule,
    ]
})
export class CustomPagesManagerModule {
    static forRoot(config: CustomPageManagerConfig): ModuleWithProviders {
        return {
            ngModule: CustomPagesManagerModule,
            providers: [
                {
                    provide: CUSTOM_PAGE_CONFIG_TOKEN,
                    useValue: config,
                    multi: true,
                }
            ]
        };
    }
}
