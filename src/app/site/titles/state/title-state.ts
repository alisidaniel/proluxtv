import {Action, Selector, State, StateContext, Store} from '@ngxs/store';
import {TitleStateModel} from './title-state-model';
import {TITLE_STATE_MODEL_DEFAULTS} from './title-state-model-defaults';
import {Router} from '@angular/router';
import {
    AddVideo,
    CrupdateReview,
    DeleteReview,
    DeleteVideo,
    LoadRelatedTitles,
    LoadReviews,
    LoadTitle,
    RateVideo, ReportVideo,
    SetTitle, UpdateVideo
} from './title-actions';
import {TitlesService} from '../titles.service';
import {tap} from 'rxjs/operators';
import {ReviewService} from '../../shared/review.service';
import {objectsAreEqual} from '@common/core/utils/objects-are-equal';
import {VideoService} from '../../videos/video.service';
import {Toast} from '@common/core/ui/toast.service';
import {SettingsState} from '../../settings-state';

@State<TitleStateModel>({
    name: 'title',
    defaults: TITLE_STATE_MODEL_DEFAULTS,
})
export class TitleState {
    constructor(
        private router: Router,
        private store: Store,
        private titles: TitlesService,
        private reviews: ReviewService,
        private videos: VideoService,
        private toast: Toast,
    ) {}

    @Selector()
    static backdrop(state: TitleStateModel) {
        return state.title.backdrop;
    }

    @Selector()
    static videoCoverImage(state: TitleStateModel) {
        const episodeImage = state.episode && state.episode.poster,
            titleImage = state.title.images[0];

        let image = episodeImage || titleImage || state.title.backdrop;

        if (typeof image !== 'string') {
            image = image.url;
        }

        return image || null;
    }

    @Selector([SettingsState.setting('streaming.prefer_full')])
    static primaryVideo(state: TitleStateModel, preferFull: boolean) {
        if (preferFull) {
            return state.title.videos.find(video => video.category === 'full' && video.type !== 'external');
        } else {
            return state.title.videos.find(video => video.category !== 'full' && video.type !== 'external');
        }
    }

    @Selector([SettingsState.setting('streaming.video_panel_content')])
    static videos(state: TitleStateModel, category: string) {
        switch (category) {
            case 'full':
                return state.videos.filter(v => v.category === 'full');
            case 'short':
                return state.videos.filter(v => v.category !== 'full');
            case 'trailer':
                return state.videos.filter(v => v.category === 'trailer');
            case 'clip':
                return state.videos.filter(v => v.category === 'clip');
            default:
                return state.videos;
        }
    }

    @Selector()
    static loading(state: TitleStateModel) {
        return state.loading;
    }

    @Selector()
    static episodes(state: TitleStateModel) {
        return state.episodes || state.title.season.episodes;
    }

    @Selector()
    static episode(state: TitleStateModel) {
        return state.episode;
    }

    @Selector()
    static title(state: TitleStateModel) {
        return state.title;
    }

    @Selector()
    static seasons(state: TitleStateModel) {
        return state.title.seasons;
    }

    @Selector()
    static season(state: TitleStateModel) {
        return state.season;
    }

    @Selector()
    static reviews(state: TitleStateModel) {
        return state.title.reviews;
    }

    @Selector()
    static relatedTitles(state: TitleStateModel) {
        return state.related;
    }

    @Selector()
    static titleOrEpisodeCredits(state: TitleStateModel) {
        if (state.episode) {
            return state.season.credits.concat(state.episode.credits);
        } else {
            return state.title.credits;
        }
    }

    @Selector([TitleState.titleOrEpisodeCredits])
    static titleOrEpisodeCast(state: TitleStateModel, credits) {
        return credits.filter(person => person.pivot.department === 'cast');
    }

    @Selector()
    static titleOrEpisode(state: TitleStateModel) {
        return state.episode || state.title;
    }

    @Selector()
    static currentEpisode(state: TitleStateModel) {
        return state.current_episode;
    }

    @Selector()
    static nextEpisode(state: TitleStateModel) {
        return state.next_episode;
    }

    @Selector()
    static metaTags(state: TitleStateModel) {
        return state.metaTags;
    }

    @Action(LoadTitle)
    loadTitle(ctx: StateContext<TitleStateModel>, action: LoadTitle) {
        const state = ctx.getState();
        // already have this title loaded and no query params changed, can bail
        if (objectsAreEqual(action.params, state.titleQueryParams, false)) return;
        return this.titles.get(action.titleId, action.params).pipe(tap(response => {
            ctx.dispatch(new SetTitle(response, action.params));
        }));
    }

    @Action(SetTitle)
    setTitle(ctx: StateContext<TitleStateModel>, action: SetTitle) {
        const response = action.response;
        const newState = {
            title: action.response.title,
            titleQueryParams: action.params,
            episode: null,
            season: null,
            current_episode: null,
            next_episode: null,
            metaTags: response.seo,
            videos: [],
        };

        if (action.params.episodeNumber) {
            newState.episode = response.title.season.episodes.find(ep => {
                return ep.episode_number === +action.params.episodeNumber;
            });
        }

        if (action.params.seasonNumber) {
            newState.season = response.title.season;
        }

        if (response.current_episode && response.next_episode) {
            newState.current_episode = response.current_episode;
            newState.next_episode = response.next_episode;
        }

        newState.videos = newState.title.videos;

        ctx.patchState(newState);
    }

    @Action(LoadRelatedTitles)
    loadRelatedTitles(ctx: StateContext<TitleStateModel>) {
        return this.titles.getRelatedTitles(ctx.getState().title, {limit: 5}).pipe(tap(response => {
            ctx.patchState({related: response.titles});
        }));
    }

    @Action(LoadReviews)
    loadReviews(ctx: StateContext<TitleStateModel>) {
        // reviews are already loaded
        if (ctx.getState().title.reviews) return;
        const params = {
            titleId: ctx.getState().title.id,
            limit: 35,
            withTextOnly: true,
            with: 'user',
        };
        return this.reviews.getAll(params).pipe(tap(response => {
            ctx.patchState({
                title: {...ctx.getState().title, reviews: response.pagination.data}
            });
        }));
    }

    @Action(CrupdateReview)
    crupdateReview(ctx: StateContext<TitleStateModel>, action: CrupdateReview) {
        const oldReviews = ctx.getState().title.reviews.slice();
        const index = oldReviews.findIndex(r => r.id === action.review.id);

        if (index > -1) {
            oldReviews[index] = action.review;
        } else {
            oldReviews.push(action.review);
        }

        ctx.patchState({
            title: {
                ...ctx.getState().title,
                reviews: oldReviews
            }
        });
    }

    @Action(DeleteReview)
    deleteReview(ctx: StateContext<TitleStateModel>, action: DeleteReview) {
        return this.reviews.delete([action.review.id]).pipe(tap(() => {
            const newReviews = ctx.getState().title.reviews.filter(curr => curr.id !== action.review.id);
            ctx.patchState({
                title: {
                    ...ctx.getState().title,
                    reviews: newReviews
                }
            });
        }));
    }

    @Action(AddVideo)
    addVideo(ctx: StateContext<TitleStateModel>, action: AddVideo) {
        ctx.patchState({videos: [...ctx.getState().videos, action.video]});
    }

    @Action(UpdateVideo)
    updateVideo(ctx: StateContext<TitleStateModel>, action: UpdateVideo) {
        const videos = ctx.getState().videos.map(video => {
            if (video.id === action.video.id) {
                return action.video;
            } else {
                return video;
            }
        });
        ctx.patchState({videos: videos});
    }

    @Action(RateVideo)
    rateVideo(ctx: StateContext<TitleStateModel>, action: RateVideo) {
        ctx.patchState({loading: true});
        return this.videos.rate(action.video.id, action.rating)
            .pipe(tap(response => {
                const videos = ctx.getState().videos.map(v => {
                    v = {...v};
                    if (v.id === action.video.id) {
                        v.positive_votes = response.video.positive_votes;
                        v.negative_votes = response.video.negative_votes;
                    }
                    return v;
                });
                ctx.patchState({videos: videos, loading: false});
            }, () => ctx.patchState({loading: false})));
    }

    @Action(DeleteVideo)
    deleteVideo(ctx: StateContext<TitleStateModel>, action: DeleteVideo) {
        ctx.patchState({loading: true});
        return this.videos.delete([action.video.id])
            .pipe(tap(() => {
                const videos = ctx.getState().videos.filter(v => v.id !== action.video.id);
                ctx.patchState({videos: videos, loading: false});
                this.toast.open('Video deleted.');
            }, () => ctx.patchState({loading: false})));
    }

    @Action(ReportVideo)
    reportVideo(ctx: StateContext<TitleStateModel>, action: ReportVideo) {
        ctx.patchState({loading: true});
        return this.videos.report(action.video.id)
            .pipe(tap(() => {
                ctx.patchState({loading: false});
                this.toast.open('Video reported.');
            }, () => {
                ctx.patchState({loading: false});
                this.toast.open('You have already reported this video.');
            }));
    }
}
