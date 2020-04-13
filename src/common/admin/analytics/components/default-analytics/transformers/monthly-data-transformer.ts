import { MonthlyPageViews } from '../../../types/site-analytics-data';
import {ChartConfig, ChartType} from '@common/shared/charts/base-chart';

export function transformMonthlyData(monthlyData: MonthlyPageViews): ChartConfig {
    const config = {
        selector: '.monthly-chart',
        type: ChartType.LINE,
        labels: [],
        data: [[], []]
    };

    monthlyData.current.forEach((monthData, key) => {
        // month numbers are returned 0 based from backend
        config.labels.push(key + 1);

        // current month data
        config.data[0].push(monthData.pageViews);

        // previous month data
        const prevDay = monthlyData.previous[key];
        config.data[1].push(prevDay ? prevDay.pageViews : 0);
    });

    return config;
}
