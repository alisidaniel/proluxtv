import {BrowseTitlesQueryParams} from '../../titles.service';

export class ReloadTitles {
    static readonly type = '[BrowseTitles] Reload Titles';
    constructor(public params: BrowseTitlesQueryParams) {}
}

export class LoadMoreTitles {
    static readonly type = '[BrowseTitles] LoadMoreTitles';
}

export class UpdateFilters {
    static readonly type = '[BrowseTitles] UpdateFilters';
    constructor(public filters: object) {}
}

export class LoadFilterOptions {
    static readonly type = '[BrowseTitles] Load Filter Options';
}
