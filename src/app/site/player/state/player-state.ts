import {Title} from '../../../models/title';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {tap} from 'rxjs/operators';
import {
    LoadRelatedVideos,
    PlayerOverlayClosed,
    PlayerOverlayOpened,
    PlayVideo,
    ToggleSidebar
} from './player-state-actions';
import {Video} from '../../../models/video';
import {RelatedVideosParams, TitlesService} from '../../titles/titles.service';
import {Episode} from '../../../models/episode';
import {MEDIA_TYPE} from '../../media-type';
import {Settings} from '@common/core/config/settings.service';

interface PlayerStateModel {
    activeVideo?: Video;
    mediaItem?: Title|Episode;
    relatedVideos: Video[];
    isOpen: boolean;
    sidebarOpen: boolean;
}

@State<PlayerStateModel>({
    name: 'player',
    defaults: {
        relatedVideos: [],
        isOpen: false,
        sidebarOpen: true,
    }
})
export class PlayerState {
    constructor(
        private titles: TitlesService,
        private settings: Settings
    ) {}

    @Selector()
    static isOpen(state: PlayerStateModel) {
        return state.isOpen;
    }

    @Selector()
    static activeVideo(state: PlayerStateModel) {
        return state.activeVideo;
    }

    @Selector()
    static relatedVideos(state: PlayerStateModel) {
        return state.relatedVideos;
    }

    @Selector()
    static mediaItem(state: PlayerStateModel) {
        return state.mediaItem;
    }

    @Selector()
    static sidebarOpen(state: PlayerStateModel) {
        return state.sidebarOpen;
    }

    @Action(PlayVideo)
    playVideo(ctx: StateContext<PlayerStateModel>, action: PlayVideo) {
        const state = ctx.getState();

        // already have this video and title loaded
        if (state.activeVideo && state.activeVideo.id === action.video.id) {
            return;
        }

        // if playing different videos for same title, there's no need to replace media item
        const newState = {activeVideo: action.video} as PlayerStateModel;
        if (action.mediaItem) {
            newState.mediaItem = action.mediaItem;
        }

        ctx.patchState(newState);

        const videoType = this.settings.get('streaming.related_videos_type');

        // related videos panel will be hidden
        if (videoType === 'hide') return;

        // load related videos from other titles or other episodes from same title (if it's a series)
        const loadRelatedEpisodes = action.video.episode && this.settings.get('player.show_next_episodes');
        if (videoType === 'other_titles' || loadRelatedEpisodes) {
            ctx.dispatch(new LoadRelatedVideos());

        // show other videos from this title
        } else {
            const contentType = this.settings.get('streaming.video_panel_content'),
                relatedVideos = action.mediaItem.videos.filter(video => {
                    return contentType === 'all' ||
                        (contentType === 'short' && video.category !== 'full') ||
                        video.category === contentType;
                });
            ctx.patchState({relatedVideos});
        }
    }

    @Action(LoadRelatedVideos)
    loadRelatedVideos(ctx: StateContext<PlayerStateModel>) {
        const mediaItem =  ctx.getState().mediaItem,
            video = ctx.getState().activeVideo;

        const params = {
            episode: video.episode,
            season: video.season,
            videoId: video.id,
        } as RelatedVideosParams;

        mediaItem.type === MEDIA_TYPE.EPISODE ?
            params.titleId = mediaItem.title_id :
            params.titleId = mediaItem.id;

        return this.titles.getRelatedVideos(params).pipe(tap(response => {
            ctx.patchState({relatedVideos: response.videos});
        }));
    }

    @Action(PlayerOverlayClosed)
    playerOverlayClosed(ctx: StateContext<PlayerStateModel>) {
        return ctx.patchState({isOpen: false});
    }

    @Action(PlayerOverlayOpened)
    playerOverlayOpened(ctx: StateContext<PlayerStateModel>) {
        return ctx.patchState({isOpen: true});
    }

    @Action(ToggleSidebar)
    toggleSidebar(ctx: StateContext<PlayerStateModel>, action: ToggleSidebar) {
        const state = action.open === null ? !ctx.getState().sidebarOpen : action.open;
        return ctx.patchState({sidebarOpen: state});
    }
}
