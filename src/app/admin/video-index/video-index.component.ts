import {
    ChangeDetectionStrategy,
    Component,
    Input,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import {MatSort} from '@angular/material';
import {TitleUrlsService} from '../../site/titles/title-urls.service';
import {VideoService} from '../../site/videos/video.service';
import {Video} from '../../models/video';
import {CrupdateVideoModalComponent} from '../../site/videos/crupdate-video-modal/crupdate-video-modal.component';
import {PaginatedDataTableSource} from '@common/shared/data-table/data/paginated-data-table-source';
import {Paginator} from '@common/shared/paginator.service';
import {Modal} from '@common/core/ui/dialogs/modal.service';
import {CurrentUser} from '@common/auth/current-user';
import {Settings} from '@common/core/config/settings.service';
import {ConfirmModalComponent} from '@common/core/ui/confirm-modal/confirm-modal.component';
import {finalize} from 'rxjs/operators';
import {BehaviorSubject} from 'rxjs';
import {Toast} from '@common/core/ui/toast.service';
import {HttpErrors} from '@common/core/http/errors/http-errors.enum';
import {VIDEO_INDEX_FILTERS} from './video-index-filters';
import {Title} from '../../models/title';

@Component({
    selector: 'video-index',
    templateUrl: './video-index.component.html',
    styleUrls: ['./video-index.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [Paginator],
})
export class VideoIndexComponent implements OnInit, OnDestroy {
    @ViewChild(MatSort, {static: true}) matSort: MatSort;
    @Input() title: Title;
    public dataSource: PaginatedDataTableSource<Video>;
    public modifying$ = new BehaviorSubject<boolean>(false);

    constructor(
        public paginator: Paginator<Video>,
        private videos: VideoService,
        private modal: Modal,
        public currentUser: CurrentUser,
        public settings: Settings,
        public urls: TitleUrlsService,
        private toast: Toast,
    ) {}

    ngOnInit() {
        if (this.title) {
            // will be paginating inside parent component, so should not update query
            this.paginator.dontUpdateQueryParams = !!this.title;
        }
        this.dataSource = new PaginatedDataTableSource<Video>({
            uri: 'videos',
            dataPaginator: this.paginator,
            matSort: this.matSort,
            filters: VIDEO_INDEX_FILTERS,
            staticParams: {titleId: this.title && this.title.id}
        });

        // disable "title" filter, if showing videos for specific
        // title only but allow changing of season and episode
        this.dataSource.filterForm.get('titleId').setValue(this.title);
        this.dataSource.filterForm.get('titleId').disable();
    }

    ngOnDestroy() {
        this.paginator.destroy();
    }

    public deleteSelectedPeople() {
        const ids = this.dataSource.selectedRows.selected.map(title => title.id);
        this.videos.delete(ids).subscribe(() => {
            this.dataSource.reset();
            this.dataSource.selectedRows.clear();
        });
    }

    public maybeDeleteSelectedPeople() {
        this.modal.show(ConfirmModalComponent, {
            title: 'Delete Videos',
            body:  'Are you sure you want to delete selected videos',
            ok:    'Delete'
        }).afterClosed().subscribe(confirmed => {
            if ( ! confirmed) return;
            this.deleteSelectedPeople();
        });
    }

    public openCrupdateVideoModal(video?: Video) {
        this.modal.open(
            CrupdateVideoModalComponent,
            {video, title: video ? video.title : this.title, hideTitleSelect: !!this.title},
        ).beforeClosed().subscribe(newVideo => {
            if (newVideo) {
                this.dataSource.reset();
            }
        });
    }

    public toggleApprovedState(video: Video) {
        this.modifying$.next(true);
        const request = video.approved ?
            this.videos.disapprove(video.id) :
            this.videos.approve(video.id);
        video.approved = !video.approved;
        request
            .pipe(finalize(() => this.modifying$.next(false)))
            .subscribe(() => {}, () => {
                this.toast.open(HttpErrors.Default);
                video.approved = !video.approved;
            });
    }
}
