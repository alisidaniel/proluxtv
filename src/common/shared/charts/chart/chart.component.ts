import {Component, ViewEncapsulation, ChangeDetectionStrategy, Input, OnDestroy, ViewChild, ElementRef, OnChanges, HostBinding} from '@angular/core';
import {BaseChart, ChartConfig, ChartType} from '@common/shared/charts/base-chart';
import {ChartistLine} from '@common/shared/charts/chartist/chartist-line';
import {ChartistPie} from '@common/shared/charts/chartist/chartist-pie';

@Component({
    selector: 'chart',
    templateUrl: './chart.component.html',
    styleUrls: ['./chart.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {'class': 'chart'},
})
export class ChartComponent implements OnChanges, OnDestroy {
    @Input() chartConfig: ChartConfig;
    @Input() @HostBinding('class.no-legend') noLegend = false;
    @ViewChild('chartPlaceholder', { static: true }) chartPlaceholder: ElementRef;

    @HostBinding('class.pie-chart-container') get pieChartClass() {
        return (this.chartConfig && this.chartConfig.type === 'pie');
    }

    @HostBinding('class.line-chart-container') get lineChartClass() {
        return (this.chartConfig && this.chartConfig.type === 'line');
    }

    public chart: BaseChart;

    ngOnChanges() {
        if ( ! this.chartConfig) return;

        if (this.chartConfig.type === ChartType.LINE) {
            this.chart = new ChartistLine(this.transformConfig());
        } else {
            this.chart = new ChartistPie(this.transformConfig());
        }
    }

    ngOnDestroy() {
        if ( ! this.chart) return;
        this.chart.destroy();
    }

    private transformConfig() {
        return {
            ...this.chartConfig,
            selector: this.chartPlaceholder.nativeElement
        };
    }
}
