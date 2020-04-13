import {GetPersonResponse} from '../people.service';

export class LoadPerson {
    static readonly type = '[Person] Load';
    constructor(public personId: number) {}
}

export class SetPerson {
    static readonly type = '[Title] Set Person';
    constructor(public response: GetPersonResponse) {}
}
