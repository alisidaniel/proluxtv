import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TitlePageContainerComponent} from './titles/title-page-container/title-page-container.component';
import {TitleSecondaryDetailsPanelComponent} from './titles/title-page-container/title-secondary-details-panel/title-secondary-details-panel.component';
import {TitleCastPanelComponent} from './titles/title-page-container/title-cast-panel/title-cast-panel.component';
import {SearchInputComponent} from './search/seach-input/search-input.component';
import {HomepageComponent} from './homepage/homepage.component';
import {
    MatAutocompleteModule,
    MatButtonToggleModule,
    MatDialogModule,
    MatExpansionModule,
    MatListModule,
    MatProgressBarModule,
    MatSidenavModule,
    MatSlideToggleModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule
} from '@angular/material';
import {SiteRoutingModule} from './site-routing.module';
import {NgxsModule} from '@ngxs/store';
import {TitleState} from './titles/state/title-state';
import {TitlePrimaryDetailsPanelComponent} from './titles/title-page-container/title-primary-details-panel/title-primary-details-panel.component';
import {CrupdateListComponent} from './lists/crupdate-list/crupdate-list.component';
import {ListState} from './lists/state/list-state';
import {HomepageState} from './homepage/state/homepage-state';
import {SliderComponent} from './homepage/slider/slider.component';
import {SearchState} from './search/state/search-state';
import {SliderDirective} from './homepage/slider/slider.directive';
import {MediaGridComponent} from './shared/media-grid/media-grid.component';
import {GenreWidgetComponent} from './titles/components/genre-widget/genre-widget.component';
import {RatingWidgetComponent} from './titles/components/rating-widget/rating-widget.component';
import {SeasonPageComponent} from './titles/components/season-page/season-page.component';
import {PeopleListWidgetComponent} from './titles/components/people-list-widget/people-list-widget.component';
import {RelatedTitlesPanelComponent} from './titles/components/related-titles-panel/related-titles-panel.component';
import {FooterComponent} from './shared/footer/footer.component';
import {TitleActionButtonsComponent} from './titles/components/title-action-buttons/title-action-buttons.component';
import {GlobalLoaderHandlerService} from './shared/global-loader-handler.service';
import {MediaItemHeaderComponent} from './titles/components/media-item-header/media-item-header.component';
import {EpisodePageComponent} from './titles/components/episode-page/episode-page.component';
import {CurrentNextEpisodePanelComponent} from './titles/components/current-next-episode-panel/current-next-episode-panel.component';
import {PersonPageComponent} from './people/person-page/person-page.component';
import {PersonState} from './people/state/person-state';
import {CrupdateTitleState} from '../admin/titles-page/crupdate-title/state/crupdate-title-state';
import {SearchPageComponent} from './search/search-page/search-page.component';
import {ListPageComponent} from './lists/list-page/list-page.component';
import {UserListsState} from './lists/user-lists/state/user-lists-state';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {UserListsComponent} from './lists/user-lists/user-lists.component';
import {MoreLessTextDirective} from './shared/more-less-text.directive';
import {BrowseTitlesComponent} from './titles/components/browse-titles/browse-titles.component';
import {BrowseTitleState} from './titles/state/browse/browse-title.state';
import {SeasonEpisodeNumberComponent} from './titles/components/season-episode-number/season-episode-number.component';
import {FullCreditsPageComponent} from './titles/components/full-credits-page/full-credits-page.component';
import {StarRatingOverlayComponent} from './titles/components/rating-widget/star-rating-overlay/star-rating-overlay.component';
import {CrupdateReviewModalComponent} from './reviews/crupdate-review-modal/crupdate-review-modal.component';
import {ReviewTabComponent} from './reviews/review-tab/review-tab.component';
import {StarRatingWidgetComponent} from './reviews/star-rating-widget/star-rating-widget.component';
import {TextFieldModule} from '@angular/cdk/text-field';
import {NewsArticleComponent} from './news/news-article/news-article.component';
import {NewsIndexComponent} from './news/news-index/news-index.component';
import {RangeSliderComponent} from './shared/range-slider/range-slider.component';
import {CrupdateVideoModalComponent} from './videos/crupdate-video-modal/crupdate-video-modal.component';
import {CrupdatePersonState} from '../admin/people-page/crupdate-person-page/state/crupdate-person-state';
import {PeopleIndexComponent} from './people/people-index/people-index.component';
import {KnownForWidgetComponent} from './people/known-for-widget/known-for-widget.component';
import {ImageGalleryOverlayComponent} from './shared/image-gallery-overlay/image-gallery-overlay.component';
import {ImportMediaModalComponent} from './shared/import-media-modal/import-media-modal.component';
import {HAMMER_GESTURE_CONFIG} from '@angular/platform-browser';
import {AppHammerGestureConfig} from './app-hammer-gesture-config';
import {UiModule} from '@common/core/ui/ui.module';
import {ChipInputModule} from '@common/core/ui/chip-input/chip-input.module';
import {SortDropdownComponent} from './titles/components/browse-titles/sort-dropdown/sort-dropdown.component';
import {StreamableLabelComponent} from './titles/components/streamable-label/streamable-label.component';
import {TitleVideosComponent} from './videos/title-videos/title-videos.component';
import {TitleVideoTableComponent} from './videos/title-videos/title-video-table/title-video-table.component';
import {TitleVideoCarouselComponent} from './videos/title-videos/title-video-carousel/title-video-carousel.component';
import {VideoRatingWidgetComponent} from './videos/title-videos/video-rating-widget/video-rating-widget.component';
import {EditTitleVideoWidgetComponent} from './videos/title-videos/edit-title-video-widget/edit-title-video-widget.component';
import {DataTableInputsModule} from '../admin/data-table-inputs/data-table-inputs.module';
import {UploadsModule} from '@common/uploads/uploads.module';
import {BackToTopButtonComponent} from './shared/back-to-top-button/back-to-top-button.component';
import {CrupdateCaptionModalComponent} from './captions/crupdate-caption-modal/crupdate-caption-modal.component';
import {CaptionsPanelComponent} from './videos/crupdate-video-modal/captions-panel/captions-panel.component';
import {PlayerModule} from './player/player.module';
import {LandingComponent} from './landing/landing.component';
import {HomepageHostComponent} from './homepage/homepage-host/homepage-host.component';
import {SettingsState} from './settings-state';
import {MediaImageModule} from './shared/media-image/media-image.module';

@NgModule({
    imports: [
        CommonModule,
        UiModule,
        SiteRoutingModule,
        ChipInputModule,
        DataTableInputsModule,
        UploadsModule,
        MediaImageModule,
        PlayerModule,

        // material
        MatAutocompleteModule,
        MatSidenavModule,
        MatExpansionModule,
        DragDropModule,
        MatTableModule,
        MatListModule,
        MatTabsModule,
        MatDialogModule,
        TextFieldModule,
        MatButtonToggleModule,
        MatSlideToggleModule,
        MatProgressBarModule,
        MatSortModule,

        // state
        NgxsModule.forFeature([
            SettingsState,
            TitleState,
            PersonState,
            ListState,
            SearchState,
            HomepageState,
            UserListsState,
            BrowseTitleState,

            // TODO: move into admin later
            CrupdateTitleState,
            CrupdatePersonState,
        ]),
    ],
    declarations: [
        TitlePageContainerComponent,
        TitleSecondaryDetailsPanelComponent,
        TitleCastPanelComponent,
        SearchInputComponent,
        HomepageComponent,
        TitlePrimaryDetailsPanelComponent,
        CrupdateListComponent,
        SliderComponent,
        SliderDirective,
        MediaGridComponent,
        GenreWidgetComponent,
        RatingWidgetComponent,
        SeasonPageComponent,
        PeopleListWidgetComponent,
        RelatedTitlesPanelComponent,
        FooterComponent,
        TitleActionButtonsComponent,
        MediaItemHeaderComponent,
        EpisodePageComponent,
        CurrentNextEpisodePanelComponent,
        PersonPageComponent,
        SearchPageComponent,
        ListPageComponent,
        UserListsComponent,
        MoreLessTextDirective,
        BrowseTitlesComponent,
        SeasonEpisodeNumberComponent,
        FullCreditsPageComponent,
        StarRatingOverlayComponent,
        CrupdateReviewModalComponent,
        ReviewTabComponent,
        StarRatingWidgetComponent,
        NewsArticleComponent,
        NewsIndexComponent,
        RangeSliderComponent,
        TitleVideosComponent,
        CrupdateVideoModalComponent,
        PeopleIndexComponent,
        KnownForWidgetComponent,
        ImageGalleryOverlayComponent,
        ImportMediaModalComponent,
        SortDropdownComponent,
        StreamableLabelComponent,
        TitleVideoTableComponent,
        TitleVideoCarouselComponent,
        VideoRatingWidgetComponent,
        EditTitleVideoWidgetComponent,
        BackToTopButtonComponent,
        CrupdateCaptionModalComponent,
        CaptionsPanelComponent,
        LandingComponent,
        HomepageHostComponent,
    ],
    entryComponents: [
        StarRatingOverlayComponent,
        CrupdateReviewModalComponent,
        CrupdateVideoModalComponent,
        ImageGalleryOverlayComponent,
        ImportMediaModalComponent,
        CrupdateCaptionModalComponent,
        LandingComponent,
    ],
    exports: [
        MediaImageModule,
        SearchInputComponent,
        ReviewTabComponent,
        TextFieldModule,
    ],
    providers: [
        {
            provide: HAMMER_GESTURE_CONFIG,
            useClass: AppHammerGestureConfig,
        }
    ]
})
export class SiteModule {
    constructor(
        private globalLoaderHandler: GlobalLoaderHandlerService,
    ) {}
}
