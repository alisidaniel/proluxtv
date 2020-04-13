import {MEDIA_TYPE} from '../site/media-type';
import {User} from '../../common/core/types/models/User';

export class Review {
    id: number;
    score?: number;
    media_type: MEDIA_TYPE.EPISODE|MEDIA_TYPE.MOVIE;
    reviewable_id: number;
    user_id: number;
    link?: string;
    user?: User;

    constructor(params: Object = {}) {
        for (const name in params) {
            this[name] = params[name];
        }
    }
}
