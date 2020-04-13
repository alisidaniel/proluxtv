import {MEDIA_TYPE} from '../../media-type';

export class SearchEverything {
    static readonly type = '[Search] Search Everything';
    constructor(public query: string, public type?: MEDIA_TYPE, public limit = 8) {}
}

export class SetQuery {
    static readonly type = '[Search] Set Query';
    constructor(public query: string) {}
}

export class Reset {
    static readonly type = '[Search] Reset';
}

