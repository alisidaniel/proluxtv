import {ComponentType} from '@angular/cdk/portal';

export interface DataTableFilter {
    name: string;
    column: string;
    defaultValue?: string;
    condition?: string;
    type?: 'date' | 'select' | 'user-select' | 'custom';
    component?: ComponentType<any>;
    options?: DataTableFilterOption[];
}

export interface DataTableFilterOption {
    name: string;
    displayName?: string;
    value?: boolean | number | string;
}
