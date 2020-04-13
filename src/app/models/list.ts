import {ListItem} from '../site/lists/types/list-item';

export class List {
    id: number;
    name: string;
    description: string;
    items: ListItem[];
    system: boolean;
    public: boolean;
    user_id: number;
    items_count?: number;

    constructor(params: object = {}) {
        for (const name in params) {
            this[name] = params[name];
        }
    }
}
