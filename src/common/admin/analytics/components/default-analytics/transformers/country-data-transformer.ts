import { BrowserData, CountryData } from '../../../types/site-analytics-data';
import { ChartConfig, ChartType } from '../../../../../shared/charts/base-chart';

export function transformCountryData(countriesData: CountryData[]): ChartConfig {
    return {
        selector: '.countries-chart',
        type: ChartType.PIE,
        labels: countriesData.map(data => data.country),
        data: countriesData.map(data => data.sessions),
        legend: true,
    };
}
