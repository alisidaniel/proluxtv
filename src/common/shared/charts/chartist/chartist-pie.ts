import * as Chartist from 'chartist';
import { IChartistPieChart, IPieChartOptions } from 'chartist';
import {BaseChart} from '@common/shared/charts/base-chart';

export class ChartistPie extends BaseChart {
    protected pieConfig: IPieChartOptions = {
        showLabel: false,
        chartPadding: 0
    };

    protected chart: IChartistPieChart;

    protected generate() {
        this.chart = new Chartist.Pie(
            this.config.selector,
            this.transformChartData(),
            this.pieConfig,
        );
    }

    protected transformChartData() {
        return {
            labels: this.config.labels,
            series: this.config.data,
        };
    }

    public destroy() {
        if (this.chart) {
            this.chart.detach();
        }
    }
}
