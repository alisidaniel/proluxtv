import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {FormBuilder} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Title} from '../../../models/title';
import {VideoService} from '../video.service';
import {finalize} from 'rxjs/operators';
import {MESSAGES} from '../../../toast-messages';
import {Video} from '../../../models/video';
import {UploadQueueService} from '@common/uploads/upload-queue/upload-queue.service';
import {Toast} from '@common/core/ui/toast.service';
import {Settings} from '@common/core/config/settings.service';
import {openUploadWindow} from '@common/uploads/utils/open-upload-window';
import {UploadInputTypes} from '@common/uploads/upload-input-config';
import {LanguageListItem, ValueLists} from '@common/core/services/value-lists.service';
import {Router} from '@angular/router';

interface AddVideoModalData {
    video?: Video;
    title?: Title;
    season?: number;
    episode?: number;
    hideTitleSelect?: boolean;
    hideEpisodeSelect?: boolean;
}

@Component({
    selector: 'crupdate-video-modal',
    templateUrl: './crupdate-video-modal.component.html',
    styleUrls: ['./crupdate-video-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [UploadQueueService],
})
export class CrupdateVideoModalComponent implements OnInit {
    public loading$ = new BehaviorSubject(false);
    public languages$ = new BehaviorSubject<LanguageListItem[]>([]);
    public episodeCount$ = new BehaviorSubject([]);
    public videoForm = this.fb.group({
        name: [],
        thumbnail: [],
        url: [],
        quality: ['hd'],
        type: ['video'],
        category: ['trailer'],
        title: [],
        title_id: [],
        season: [],
        episode: [],
        language: ['en'],
        order: [0],
    });

    constructor(
        private fb: FormBuilder,
        private videos: VideoService,
        private toast: Toast,
        private uploadQueue: UploadQueueService,
        private valueLists: ValueLists,
        public settings: Settings,
        private router: Router,
        private dialogRef: MatDialogRef<CrupdateVideoModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: AddVideoModalData,
    ) {}

    ngOnInit() {
        this.hydrateForm();
        this.valueLists.get(['languages']).subscribe(response => {
            this.languages$.next(response.languages);
        });
    }

    public confirm() {
        this.loading$.next(true);
        if (this.data.video) {
            this.updateVideo();
        } else {
            this.createVideo();
        }
    }

    public getPayload() {
        const payload = this.videoForm.value;
        if (payload.title) {
            payload.title_id = payload.title.id;
            delete payload.title;
        }
        return payload;
    }

    private createVideo() {
        this.videos.create(this.getPayload())
            .pipe(finalize(() => this.loading$.next(false)))
            .subscribe(response => {
                this.toast.open(MESSAGES.VIDEO_CREATE_SUCCESS);
                this.close(response.video);
            }, () => {
                this.toast.open(MESSAGES.VIDEO_CREATE_FAILED);
            });
    }

    private updateVideo() {
        this.videos.update(this.data.video.id, this.getPayload())
            .pipe(finalize(() => this.loading$.next(false)))
            .subscribe(response => {
                this.toast.open(MESSAGES.VIDEO_UPDATE_SUCCESS);
                this.close(response.video);
            }, () => {
                this.toast.open(MESSAGES.VIDEO_UPDATE_FAILED);
            });
    }

    public close(video?: Video) {
        this.dialogRef.close(video);
    }

    public uploadFile(type: 'image'|'video') {
        openUploadWindow({types: [UploadInputTypes[type]]}).then(upload => {
            const params = {
                uri: `uploads/${type}s`,
                httpParams: {
                    path: type === 'image' ? 'media-images/videos' : 'title-videos'
                },
            };

            this.uploadQueue.start(upload, params).subscribe(fileEntry => {
                const prop = type === 'image' ? 'thumbnail' : 'url';
                this.videoForm.patchValue({
                    [prop]: this.settings.getBaseUrl(true) + fileEntry.url
                });
                if (type === 'video') {
                    this.videoForm.patchValue({type: 'video'});
                }
            });
        });
    }

    public getIterableFromNumber(number) {
        return Array.from(new Array(number), (v, i) => i + 1);
    }

    public isSeries() {
        return this.data.title && this.data.title.is_series;
    }

    private hydrateForm() {
        // update episode count, when season number changes
        this.videoForm.get('season').valueChanges.subscribe(number => {
            this.episodeCount$.next(this.getEpisodeCountForSeason(number));
        });

        // set specified video
        if (this.data.video) {
            this.videoForm.patchValue(this.data.video);
        }

        if (this.data.title) {
            this.videoForm.patchValue({title: this.data.title});
        }

        // hydrate season and episode number, if media item is series
        if (this.isSeries() && ! this.data.video && ! this.videoForm.value.season) {
            this.videoForm.patchValue({
                season: this.data.season || this.getFirstSeasonNumber(),
                episode: this.data.episode || 1
            });
        }
    }

    public getEpisodeCountForSeason(seasonNum: number) {
        let episodeCount = 24;
        if (this.data.title) {
            const season = this.data.title.seasons ? this.data.title.seasons.find(s => s.number === seasonNum) : null;
            if (season) {
                episodeCount = season.episodes && season.episodes.length ? season.episodes.length : season.episode_count;
            }
        }
        return  this.getIterableFromNumber(episodeCount);
    }

    private getFirstSeasonNumber(): number {
        const title = this.data.title;
        if (title.seasons && title.seasons.length) {
            return title.seasons[0].number;
        } else {
            return 1;
        }
    }

    public insideAdmin(): boolean {
        return this.router.url.indexOf('admin') > -1;
    }
}
