import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsHostComponent } from './components/analytics-host/analytics-host.component';
import { AnalyticsHeaderComponent } from './components/analytics-header/analytics-header.component';
import { UiModule } from '../../core/ui/ui.module';
import { AnalyticsRoutingRoutingModule } from './analytics-routing-routing.module';
import {ChartsModule} from '@common/shared/charts/charts.module';
import { DefaultAnalyticsComponent } from './components/default-analytics/default-analytics.component';

@NgModule({
    imports: [
        CommonModule,
        UiModule,
        AnalyticsRoutingRoutingModule,
        ChartsModule,
    ],
    declarations: [
        AnalyticsHostComponent,
        AnalyticsHeaderComponent,
        DefaultAnalyticsComponent,
    ]
})
export class AnalyticsModule {
}
