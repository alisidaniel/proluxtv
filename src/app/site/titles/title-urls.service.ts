import {Injectable} from '@angular/core';
import {Title} from '../../models/title';
import {MEDIA_TYPE} from '../media-type';
import {Person} from '../../models/person';
import {Episode} from '../../models/episode';
import {NewsArticle} from '../../models/news-article';
import {slugifyString} from '@common/core/utils/slugify-string';

@Injectable({
    providedIn: 'root'
})
export class TitleUrlsService {
    constructor() {}

    public mediaItem(item: Title | Person | Episode | NewsArticle): any[] {
        switch (item.type) {
            case MEDIA_TYPE.TITLE:
                const i = (item as Title);
                return ['/titles', item.id, i.name ? slugifyString(i.name) : ''];
            case MEDIA_TYPE.PERSON:
                return ['/people', item.id, slugifyString((item as Person).name)];
            case MEDIA_TYPE.EPISODE:
                const ep = item as Episode;
                return ['/titles', ep.title_id, 'season', ep.season_number, 'episode', ep.episode_number];
            case MEDIA_TYPE.NEWS:
                return ['/news', item.id];
        }
    }

    public season(series: Title, seasonNumber: number) {
        return ['/titles', series.id, slugifyString(series.name), 'season', seasonNumber];
    }

    public episode(series: Title, season: number, episode: number) {
        return this.season(series, season).concat(['episode', episode]);
    }
}
