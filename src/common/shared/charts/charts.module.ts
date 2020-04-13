import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UiModule} from '@common/core/ui/ui.module';
import {ChartComponent} from '@common/shared/charts/chart/chart.component';

@NgModule({
    imports: [
        CommonModule,
        UiModule,
    ],
    declarations: [
        ChartComponent
    ],
    exports: [
        ChartComponent,
    ]
})
export class ChartsModule {
}
