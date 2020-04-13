import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    HostBinding,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {PlayerState} from '../state/player-state';
import {BehaviorSubject, Observable} from 'rxjs';
import {Video} from '../../../models/video';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {PlayerOverlayClosed, PlayerOverlayOpened, PlayVideo, ToggleSidebar} from '../state/player-state-actions';
import {Title} from '../../../models/title';
import {Episode} from '../../../models/episode';
import {LazyLoaderService} from '@common/core/utils/lazy-loader.service';
import {OverlayPanelRef} from '@common/core/ui/overlay-panel/overlay-panel-ref';
import {BreakpointsService} from '@common/core/ui/breakpoints.service';
import {Settings} from '@common/core/config/settings.service';

declare const Plyr: any;

@Component({
    selector: 'player',
    templateUrl: './player.component.html',
    styleUrls: ['./player.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayerComponent implements OnInit, OnDestroy {
    @Select(PlayerState.activeVideo) activeVideo$: Observable<Video>;
    @Select(PlayerState.relatedVideos) relatedVideos$: Observable<Video[]>;
    @Select(PlayerState.mediaItem) mediaItem$: Observable<Title|Episode>;
    @Select(PlayerState.sidebarOpen) sidebarOpen$: Observable<boolean>;

    public loading$ = new BehaviorSubject<boolean>(false);
    public iframeUrl$: BehaviorSubject<SafeResourceUrl> = new BehaviorSubject(null);
    public plyr: any;

    @ViewChild('plyrEl', {static: false}) plyrEl: ElementRef<HTMLElement>;
    @HostBinding('class.minimized') public minimized = false;

    public trackByFn = (i: number, video: Video) => video.id;

    constructor(
        private store: Store,
        private sanitizer: DomSanitizer,
        private overlayRef: OverlayPanelRef,
        public breakpoints: BreakpointsService,
        private lazyLoader: LazyLoaderService,
        public settings: Settings,
    ) {}

    ngOnInit() {
        this.store.dispatch(new PlayerOverlayOpened());
        this.activeVideo$.subscribe(video => {
            if (this.shouldUsePlyr(video)) {
                this.loadPlyr(video);
                this.iframeUrl$.next(null);
            } else {
                this.plyr && this.plyr.stop();
                if (video.type === 'external') {
                    this.iframeUrl$.next(null);
                    window.open(video.url, '_blank');
                } else {
                    this.iframeUrl$.next(this.sanitizer.bypassSecurityTrustResourceUrl(video.url));
                }
            }
        });

        // hide sidebar on mobile
        if (this.breakpoints.isMobile$.value) {
            this.toggleSidebar();
        }
    }

    ngOnDestroy() {
        this.store.dispatch(new PlayerOverlayClosed());
        this.plyr && this.plyr.destroy();
    }

    public playVideo(video: Video) {
        this.store.dispatch(new PlayVideo(video, video.title));
    }

    public toggleSidebar() {
        this.store.dispatch(new ToggleSidebar());
    }

    public close() {
        this.overlayRef.close();
    }

    public isTabletOrMobile() {
        return this.breakpoints.isMobile$.value ||
            this.breakpoints.isTablet$.value;
    }

    private shouldUsePlyr(video: Video) {
        return video.type === 'video' ||
            (video.type === 'embed' && this.embedSupportedByPlyr(video.url));
    }

    private loadPlyr(video: Video): Promise<any> {
        if (this.plyr) {
            this.plyr.source = this.getPlyrSource(video);
            return new Promise(resolve => resolve());
        } else {
            this.loading$.next(true);
            return Promise.all([
                this.lazyLoader.loadAsset('js/plyr.min.js', {type: 'js'}),
                this.lazyLoader.loadAsset('css/plyr.min.css', {type: 'css'}),
            ]).then(() => {
                this.loading$.next(false);
                this.plyr = new Plyr(this.plyrEl.nativeElement, {autoplay: true});
                this.plyr.source = this.getPlyrSource(video);
            });
        }
    }

    private isYoutube(url: string): boolean {
        return url.includes('youtube.com');
    }

    private isVimeo(url: string): boolean {
        return url.includes('vimeo.com');
    }

    public embedSupportedByPlyr(url: string): boolean {
        return this.isYoutube(url) || this.isVimeo(url);
    }

    private getPlyrSource(video: Video) {
        if (video.type === 'embed') {
            return {
                type: 'video',
                poster: video.thumbnail,
                sources: [{
                    src: video.url,
                    provider: this.isYoutube(video.url) ? 'youtube' : 'vimeo',
                }],
            };
        } else {
            const tracks = (video.captions || []).map((caption, i) => {
                return {
                    kind: 'captions',
                    label: caption.name,
                    srclang: caption.language,
                    src: caption.url ? caption.url : this.settings.getBaseUrl() + 'secure/caption/' + caption.id,
                    default: i === 0,
                };
            });
            return {
                type: 'video',
                title: video.name,
                sources: [
                    {src: video.url},
                ],
                poster: video.thumbnail,
                tracks: tracks,
            };
        }
    }
}
