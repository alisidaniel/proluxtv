import {Injectable} from '@angular/core';
import {AppHttpClient} from '../../../common/core/http/app-http-client.service';
import {BackendResponse} from '../../../common/core/types/backend-response';
import {Title} from '../../models/title';
import {MEDIA_TYPE} from '../media-type';

@Injectable({
    providedIn: 'root'
})
export class SearchService {
    constructor(private http: AppHttpClient) {}

    public everything(query: string, queryParams: {type?: MEDIA_TYPE, limit?: number}): BackendResponse<{results: Title[]}> {
        return this.http.get('search/' + encodeURIComponent(query), queryParams);
    }
}
