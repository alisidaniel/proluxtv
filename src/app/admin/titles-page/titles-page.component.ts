import {Component, OnDestroy, OnInit, ViewEncapsulation, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material';
import {Title} from '../../models/title';
import {TitlesService} from '../../site/titles/titles.service';
import {TitleUrlsService} from '../../site/titles/title-urls.service';
import {ImportMediaModalComponent} from '../../site/shared/import-media-modal/import-media-modal.component';
import {MEDIA_TYPE} from '../../site/media-type';
import {Router} from '@angular/router';
import {PaginatedDataTableSource} from '@common/shared/data-table/data/paginated-data-table-source';
import {Paginator} from '@common/shared/paginator.service';
import {Modal} from '@common/core/ui/dialogs/modal.service';
import {CurrentUser} from '@common/auth/current-user';
import {Settings} from '@common/core/config/settings.service';
import {ConfirmModalComponent} from '@common/core/ui/confirm-modal/confirm-modal.component';

@Component({
    selector: 'titles-page',
    templateUrl: './titles-page.component.html',
    styleUrls: ['./titles-page.component.scss'],
    providers: [Paginator],
    encapsulation: ViewEncapsulation.None,
})
export class TitlesPageComponent implements OnInit, OnDestroy {
    @ViewChild(MatSort, {static: true}) matSort: MatSort;

    public dataSource: PaginatedDataTableSource<Title>;

    constructor(
        public paginator: Paginator<Title>,
        private titleService: TitlesService,
        private modal: Modal,
        public currentUser: CurrentUser,
        public settings: Settings,
        public urls: TitleUrlsService,
        private router: Router,
    ) {}

    ngOnInit() {
        this.dataSource = new PaginatedDataTableSource<Title>({
            uri: 'titles',
            dataPaginator: this.paginator,
            matSort: this.matSort
        });
    }

    ngOnDestroy() {
        this.paginator.destroy();
    }

    public deleteSelectedTitles() {
        const ids = this.dataSource.selectedRows.selected.map(title => title.id);

        this.titleService.delete(ids).subscribe(() => {
            this.dataSource.reset();
            this.dataSource.selectedRows.clear();
        });
    }

    public maybeDeleteSelectedTitles() {
        this.modal.show(ConfirmModalComponent, {
            title: 'Delete Titles',
            body:  'Are you sure you want to delete selected titles?',
            ok:    'Delete'
        }).afterClosed().subscribe(confirmed => {
            if ( ! confirmed) return;
            this.deleteSelectedTitles();
        });
    }

    public openImportMediaModal() {
        this.modal.open(
            ImportMediaModalComponent,
            {mediaTypes: [MEDIA_TYPE.MOVIE, MEDIA_TYPE.SERIES]},
        ).beforeClosed().subscribe(mediaItem => {
            if (mediaItem) {
                this.router.navigate(['/admin/titles', mediaItem.id, 'edit']);
            }
        });
    }
}
