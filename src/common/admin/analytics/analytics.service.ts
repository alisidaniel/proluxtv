import {Injectable} from '@angular/core';
import {AnalyticsHeaderData, AnalyticsResponse} from '@common/admin/analytics/types/analytics-response';
import {finalize} from 'rxjs/operators';
import {AppHttpClient} from '@common/core/http/app-http-client.service';
import {BehaviorSubject, of, ReplaySubject} from 'rxjs';
import {SiteAnalyticsData} from '@common/admin/analytics/types/site-analytics-data';

@Injectable({
    providedIn: 'root'
})
export class AnalyticsService {
    public loading$ = new BehaviorSubject<boolean>(false);
    public headerData$ = new ReplaySubject<AnalyticsHeaderData[]>(1);
    public mainData$ = new ReplaySubject<SiteAnalyticsData>(1);
    private activeChannel: string;
    private cache: {[key: string]: AnalyticsResponse} = {};

    constructor(private http: AppHttpClient) {}

    public getData(channel: string) {
        if (this.activeChannel === channel) return;
        this.loading$.next(true);
        this.mainData$.next(null);
        this.activeChannel = channel;
        this.fetchOrGetFromCache(channel)
            .pipe(finalize(() => this.loading$.next(false)))
            .subscribe(response => {
                this.cache[channel] = response;
                if (response.headerData.length) {
                    this.headerData$.next(response.headerData);
                }

                if (Object.keys(response.mainData).length) {
                    this.mainData$.next(response.mainData);
                }
            });
    }

    private fetchOrGetFromCache(channel: string) {
        if (this.cache[channel]) {
            return of(this.cache[channel]);
        } else {
            return this.http.get<AnalyticsResponse>('admin/analytics/stats', {channel});
        }
    }
}
