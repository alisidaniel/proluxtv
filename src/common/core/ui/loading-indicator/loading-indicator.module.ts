import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoadingIndicatorComponent} from '@common/core/ui/loading-indicator/loading-indicator.component';

@NgModule({
    declarations: [
        LoadingIndicatorComponent,
    ],
    imports: [
        CommonModule
    ],
    exports: [
        LoadingIndicatorComponent,
    ]
})
export class LoadingIndicatorModule {
}
