import * as Chartist from 'chartist';
import {IChartistLineChart, ILineChartOptions} from 'chartist';
import {BaseChart} from '@common/shared/charts/base-chart';

export class ChartistLine extends BaseChart {
    protected lineConfig: ILineChartOptions = {
        showArea: true,
        lineSmooth: true,
        low: 0,
        fullWidth: true,
        chartPadding: {
            left: 15,
            right: 30,
        },
        axisY: {
            // 0,454 => 0,4 when displaying chart with no data
            labelInterpolationFnc: (val) => Math.floor(val)
        }
    };

    protected chart: IChartistLineChart;

    protected generate() {
        const lineConfig = {
            ...this.lineConfig,
            high: this.getHigh(),
        };
        this.chart = new Chartist.Line(
            this.config.selector,
            this.transformChartData(),
            lineConfig,
        );
    }

    protected transformChartData() {
        return  {
            labels: this.config.labels,
            series: this.config.data,
        };
    }

    protected getHigh() {
        // if chart data is empty, show 0-100 in Y axis
        const data = this.config.data[0][0];
        return Math.max(data) ? null : 100;
    }

    public destroy() {
        if (this.chart) {
            this.chart.detach();
        }
    }
}
