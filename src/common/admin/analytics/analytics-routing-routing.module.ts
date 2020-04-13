import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AnalyticsHostComponent} from './components/analytics-host/analytics-host.component';
import {APP_ANALYTIC_ROUTES} from '../../../app/admin/app-admin-routes';
import {DefaultAnalyticsComponent} from '@common/admin/analytics/components/default-analytics/default-analytics.component';

const routes: Routes = [
    {
        path: '',
        component: AnalyticsHostComponent,
        children: [
            {
                path: '',
                component: DefaultAnalyticsComponent,
            },
            ...APP_ANALYTIC_ROUTES,
        ],
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnalyticsRoutingRoutingModule { }
