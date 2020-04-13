import {GetTitleQueryParams, GetTitleResponse} from '../titles.service';
import {Review} from '../../../models/review';
import {Video} from '../../../models/video';

export class LoadTitle {
    static readonly type = '[Title] Load Title';
    constructor(public titleId: number, public params: GetTitleQueryParams = {}) {}
}

export class SetTitle {
    static readonly type = '[Title] Set Title';
    constructor(
        public response: GetTitleResponse,
        public params: GetTitleQueryParams = {},
    ) {}
}

export class LoadRelatedTitles {
    static readonly type = '[Title] Load Related Titles';
}

export class LoadReviews {
    static readonly type = '[Title] Load Reviews';
}

export class CrupdateReview {
    static readonly type = '[Title] Crupdate Review';
    constructor(public review: Review) {}
}

export class DeleteReview {
    static readonly type = '[Title] Delete Review';
    constructor(public review: Review) {}
}

export class AddVideo {
    static readonly type = '[Title] Add Video';
    constructor(public video: Video) {}
}

export class UpdateVideo {
    static readonly type = '[Title] Update Video';
    constructor(public video: Video) {}
}

export class RateVideo {
    static readonly type = '[Title] Rate Video';
    constructor(public video: Video, public rating: 'positive' | 'negative') {}
}

export class ReportVideo {
    static readonly type = '[Title] Report Video';
    constructor(public video: Video) {}
}

export class DeleteVideo {
    static readonly type = '[Title] Delete Video';
    constructor(public video: Video) {}
}
