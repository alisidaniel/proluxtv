import {Injectable} from '@angular/core';
import {NewsArticle} from '../../models/news-article';
import {AppHttpClient} from '@common/core/http/app-http-client.service';
import {PaginatedBackendResponse} from '@common/core/types/pagination/paginated-backend-response';
import {BackendResponse} from '@common/core/types/backend-response';

@Injectable({
    providedIn: 'root'
})
export class NewsService {
    constructor(private http: AppHttpClient) {}

    public getAll(params: {perPage?: number, page?: number, stripHtml?: boolean}): PaginatedBackendResponse<NewsArticle> {
        return this.http.get('news', params);
    }

    public get(id: number): BackendResponse<{article: NewsArticle}> {
        return this.http.get('news/' + id);
    }

    public create(payload: Partial<NewsArticle>): BackendResponse<{article: NewsArticle}> {
        return this.http.post('news', payload);
    }

    public update(id: number, payload: Partial<NewsArticle>): BackendResponse<{article: NewsArticle}> {
        return this.http.put('news/' + id, payload);
    }

    public delete(params: {ids: number[]}): BackendResponse<void> {
        return this.http.delete('news', params);
    }
}
