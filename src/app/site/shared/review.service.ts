import {Injectable} from '@angular/core';
import {MEDIA_TYPE} from '../media-type';
import {Review} from '../../models/review';
import {AppHttpClient} from '@common/core/http/app-http-client.service';
import {PaginatedBackendResponse} from '@common/core/types/pagination/paginated-backend-response';
import {BackendResponse} from '@common/core/types/backend-response';

interface CreateReviewPayload {
    mediaId: number;
    mediaType: MEDIA_TYPE.EPISODE | MEDIA_TYPE.TITLE;
    score: number;
    review?: string;
}

@Injectable({
    providedIn: 'root'
})
export class ReviewService {
    constructor(private http: AppHttpClient) {}

    public getAll(params: {titleId?: number, withTextOnly?: boolean, limit?: number}): PaginatedBackendResponse<Review> {
        return this.http.get('reviews', params);
    }

    public create(params: CreateReviewPayload): BackendResponse<{review: Review}> {
        return this.http.post('reviews', params);
    }

    public update(id: number, payload: Partial<Review>): BackendResponse<{review: Review}> {
        return this.http.put('reviews/' + id, payload);
    }

    public delete(ids: number[]) {
        return this.http.delete('reviews', {ids});
    }
}
