import {Permission} from '@common/core/types/models/permission';

export class Plan {
    id: number;
    name: string;
    amount: number;
    currency: string;
    currency_symbol = '$';
    interval: 'day'|'week'|'month'|'year' = 'month';
    interval_count = 1;
    parent_id: number = null;
    parent?: Plan;
    permissions: Permission[];
    recommended: 0|1 = 0;
    show_permissions: 0|1 = 0;
    free: 0|1 = 0;
    position = 0;
    features: string[] = [];
    available_space: number;

    constructor(params: Object = {}) {
        for (const name in params) {
            this[name] = params[name];
        }
    }
}
