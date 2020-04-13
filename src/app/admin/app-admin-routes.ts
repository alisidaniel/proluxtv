import {Routes} from '@angular/router';
import {TitlesPageComponent} from './titles-page/titles-page.component';
import {CrupdateTitleComponent} from './titles-page/crupdate-title/crupdate-title.component';
import {NewsPageComponent} from './news-page/news-page.component';
import {CrupdateArticleComponent} from './news-page/crupdate-article/crupdate-article.component';
import {ContentSettingsComponent} from './settings/content/content-settings.component';
import {PeoplePageComponent} from './people-page/people-page.component';
import {CrupdatePersonPageComponent} from './people-page/crupdate-person-page/crupdate-person-page.component';
import {ListsPageComponent} from './lists-page/lists-page.component';
import {CrupdateTitleResolverService} from './titles-page/crupdate-title/crupdate-title-resolver.service';
import {VideoIndexComponent} from './video-index/video-index.component';
import {StreamingSettingsComponent} from './settings/streaming-settings/streaming-settings.component';

export const APP_ADMIN_ROUTES: Routes = [
    // videos
    {
        path: 'videos',
        component: VideoIndexComponent,
        data: {permissions: ['videos.view']}
    },

    // lists
    {
        path: 'lists',
        component: ListsPageComponent,
        data: {permissions: ['lists.view']}
    },

    // news
    {
        path: 'news',
        component: NewsPageComponent,
        data: {permissions: ['news.view']}
    },
    {
        path: 'news/:id/edit',
        component: CrupdateArticleComponent,
        data: {permissions: ['news.update']}
    },
    {
        path: 'news/create',
        component: CrupdateArticleComponent,
        data: {permissions: ['news.create']}
    },

    // titles
    {
        path: 'titles',
        component: TitlesPageComponent,
        data: {permissions: ['titles.view']}
    },
    {
        path: 'titles/:id/edit',
        component: CrupdateTitleComponent,
        resolve: {api: CrupdateTitleResolverService},
        data: {permissions: ['titles.update']}
    },
    {
        path: 'titles/new',
        component: CrupdateTitleComponent,
        data: {permissions: ['titles.create']}
    },

    // people
    {
        path: 'people',
        component: PeoplePageComponent,
        data: {permissions: ['people.view']}
    },
    {
        path: 'people/:id/edit',
        component: CrupdatePersonPageComponent,
        data: {permissions: ['people.update']}
    },
    {
        path: 'people/new',
        component: CrupdatePersonPageComponent,
        data: {permissions: ['people.create']}
    },
];

export const APP_SETTING_ROUTES: Routes = [
    {
        path: 'content',
        component: ContentSettingsComponent,
    },
    {
        path: 'streaming',
        component: StreamingSettingsComponent,
    },
];

export const APP_ANALYTIC_ROUTES: Routes = [
    //
];
