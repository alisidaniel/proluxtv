import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {TitlesPageComponent} from './titles-page/titles-page.component';
import {SiteModule} from '../site/site.module';
import {CrupdateTitleComponent} from './titles-page/crupdate-title/crupdate-title.component';
import {PrimaryFactsPanelComponent} from './titles-page/crupdate-title/panels/primary-facts-panel/primary-facts-panel.component';
import {ImagesPanelComponent} from './titles-page/crupdate-title/panels/images-panel/images-panel.component';
import {CreditsPanelComponent} from './titles-page/crupdate-title/panels/credits-panel/credits-panel.component';
import {CrupdateCreditModalComponent} from './titles-page/crupdate-title/panels/crupdate-credit-modal/crupdate-credit-modal.component';
import {TagsPanelComponent} from './titles-page/crupdate-title/panels/tags-panel/tags-panel.component';
import {SeasonsPanelComponent} from './titles-page/crupdate-title/panels/seasons-panel/seasons-panel.component';
import {MatExpansionModule, MatProgressBarModule, MatTabsModule} from '@angular/material';
import {CrupdateEpisodeModalComponent} from './titles-page/crupdate-title/panels/seasons-panel/crupdate-episode-modal/crupdate-episode-modal.component';
import {NewsPageComponent} from './news-page/news-page.component';
import {CrupdateArticleComponent} from './news-page/crupdate-article/crupdate-article.component';
import {ContentSettingsComponent} from './settings/content/content-settings.component';
import {EpisodesPanelComponent} from './titles-page/crupdate-title/panels/episodes-panel/episodes-panel.component';
import {CrupdateTagModalComponent} from './titles-page/crupdate-title/panels/tags-panel/crupdate-tag-modal/crupdate-tag-modal.component';
import {PeoplePageComponent} from './people-page/people-page.component';
import {CrupdatePersonPageComponent} from './people-page/crupdate-person-page/crupdate-person-page.component';
import {ReviewsPanelComponent} from './titles-page/crupdate-title/panels/reviews-panel/reviews-panel.component';
import {ListsPageComponent} from './lists-page/lists-page.component';
import {BaseAdminModule} from '@common/admin/base-admin.module';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {VideoIndexComponent} from './video-index/video-index.component';
import {StreamingSettingsComponent} from './settings/streaming-settings/streaming-settings.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        BaseAdminModule,

        // TODO: remove later, only need media image from site module
        SiteModule,

        // material
        MatExpansionModule,
        MatTabsModule,
        MatProgressBarModule,
        DragDropModule,

        // state
        // NgxsModule.forFeature([
        //     CrupdateTitleState
        // ]),
    ],
    declarations: [
        TitlesPageComponent,
        CrupdateTitleComponent,
        PrimaryFactsPanelComponent,
        ImagesPanelComponent,
        CreditsPanelComponent,
        CrupdateCreditModalComponent,
        TagsPanelComponent,
        SeasonsPanelComponent,
        CrupdateEpisodeModalComponent,
        NewsPageComponent,
        CrupdateArticleComponent,
        ContentSettingsComponent,
        EpisodesPanelComponent,
        CrupdateTagModalComponent,
        PeoplePageComponent,
        CrupdatePersonPageComponent,
        ReviewsPanelComponent,
        VideoIndexComponent,
        ListsPageComponent,
        StreamingSettingsComponent,
    ],
    entryComponents: [
        CrupdateCreditModalComponent,
        CrupdateEpisodeModalComponent,
        CrupdateTagModalComponent,
    ],
})
export class AppAdminModule {
}
