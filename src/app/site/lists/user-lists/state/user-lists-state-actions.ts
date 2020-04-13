import {ListItem} from '../../types/list-item';
import {MinimalWatchlist} from '../../types/minimal-watchlist';
import {Review} from '../../../../models/review';

export class AddToWatchlist {
    static readonly type = '[UserLists] Add to Watchlist';
    constructor(public item: ListItem) {}
}

export class RemoveFromWatchlist {
    static readonly type = '[UserLists] Remove from Watchlist';
    constructor(public item: ListItem) {}
}

export class SetWatchlist {
    static readonly type = '[UserLists] Set Watchlist';
    constructor(public watchlist: MinimalWatchlist) {}
}

export class SetRatings {
    static readonly type = '[UserLists] Set Rating';
    constructor(public ratings: Review[]|null) {}
}

export class AddRating {
    static readonly type = '[UserLists] Add Rating';
    constructor(public rating: Review) {}
}

export class RemoveRating {
    static readonly type = '[UserLists] Remove Rating';
    constructor(public rating: Review) {}
}

export class LoadUserLists {
    static readonly type = '[UserLists] Load Lists';
}

export class ClearUserLists {
    static readonly type = '[UserLists] Clear Lists';
}

