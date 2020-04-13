export enum ChartType {
    LINE = 'line',
    PIE = 'pie'
}

export interface ChartConfig {
    selector?: string;
    type: ChartType;
    labels: string[];
    data: number[]|number[][]; // number[] is for type PIE only
    legend?: boolean;
}

export abstract class BaseChart {
    constructor(protected config: ChartConfig) {
        setTimeout(() => this.generate());
    }

    protected abstract generate();

    protected abstract transformChartData();

    public isEmpty() {
        if ( ! this.config.data) return true;
        if (Array.isArray(this.config.data[0])) {
            return Math.max(...this.config.data[0] as number[]) < 1;
        } else {
            return Math.max(...this.config.data as number[]) < 1;
        }
    }

    public abstract destroy();
}
