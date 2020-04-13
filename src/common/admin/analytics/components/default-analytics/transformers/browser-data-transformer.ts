import { BrowserData } from '../../../types/site-analytics-data';
import { ChartConfig, ChartType } from '../../../../../shared/charts/base-chart';

export function transformBrowserData(browserData: BrowserData[]): ChartConfig {
    return {
        selector: '.browsers-chart',
        type: ChartType.PIE,
        labels: browserData.map(data => data.browser),
        data: browserData.map(data => data.sessions),
        legend: true,
    };
}
