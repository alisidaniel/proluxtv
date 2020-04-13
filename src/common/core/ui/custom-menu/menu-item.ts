export class MenuItem {
    id: number;
    label: string;
    action: string;
    type = 'link';
    order = 1;
    icon: string;
    condition: string|Function = null;
    target: string = null;
    position = 0;
    activeExact = false;

    constructor(params: Object = {}) {
        for (const name in params) {
            this[name] = params[name];
        }

        this.id = Math.floor(Math.random() * (1000 - 1));
    }
}
