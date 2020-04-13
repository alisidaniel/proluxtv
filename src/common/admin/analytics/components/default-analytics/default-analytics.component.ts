import {ChangeDetectionStrategy, Component} from '@angular/core';
import {SiteAnalyticsData} from '@common/admin/analytics/types/site-analytics-data';
import {transformWeeklyData} from '@common/admin/analytics/components/default-analytics/transformers/weekly-data-transformer';
import {transformMonthlyData} from '@common/admin/analytics/components/default-analytics/transformers/monthly-data-transformer';
import {transformBrowserData} from '@common/admin/analytics/components/default-analytics/transformers/browser-data-transformer';
import {transformCountryData} from '@common/admin/analytics/components/default-analytics/transformers/country-data-transformer';
import {ChartConfigs} from '@common/admin/analytics/types/chart-configs';
import {AnalyticsService} from '@common/admin/analytics/analytics.service';
import {filter, map} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Component({
    selector: 'default-analytics',
    templateUrl: './default-analytics.component.html',
    styleUrls: ['./default-analytics.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DefaultAnalyticsComponent {
    public charts$: Observable<Partial<ChartConfigs>> = this.analytics.mainData$.pipe(
        filter(data => !!data),
        map(data => this.generateCharts(data))
    );

    constructor(private analytics: AnalyticsService) {}

    private generateCharts(data: SiteAnalyticsData) {
        return {
            weeklyPageViews: transformWeeklyData(data.weeklyPageViews),
            monthlyPageViews: transformMonthlyData(data.monthlyPageViews),
            browsers: transformBrowserData(data.browsers),
            countries: transformCountryData(data.countries)
        };
    }
}
