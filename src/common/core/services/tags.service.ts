import {Injectable} from '@angular/core';
import {AppHttpClient} from '../../core/http/app-http-client.service';
import {PaginatedBackendResponse} from '../../core/types/pagination/paginated-backend-response';
import {Tag} from '@common/core/types/models/Tag';

export const PLANS_BASE_URI = 'tags';

@Injectable({
    providedIn: 'root'
})
export class TagsService {
    constructor(private http: AppHttpClient) {}

    public index(params?: object): PaginatedBackendResponse<Tag> {
        return this.http.get(PLANS_BASE_URI, params);
    }
}
