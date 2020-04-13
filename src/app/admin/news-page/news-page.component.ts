import {Component, OnDestroy, OnInit, ViewEncapsulation, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material';
import {TitleUrlsService} from '../../site/titles/title-urls.service';
import {NewsArticle} from '../../models/news-article';
import {NewsService} from '../../site/news/news.service';
import {MESSAGES} from '../../toast-messages';
import {Paginator} from '@common/shared/paginator.service';
import {PaginatedDataTableSource} from '@common/shared/data-table/data/paginated-data-table-source';
import {Modal} from '@common/core/ui/dialogs/modal.service';
import {CurrentUser} from '@common/auth/current-user';
import {Settings} from '@common/core/config/settings.service';
import {Toast} from '@common/core/ui/toast.service';
import {ConfirmModalComponent} from '@common/core/ui/confirm-modal/confirm-modal.component';

@Component({
    selector: 'news-page',
    templateUrl: './news-page.component.html',
    styleUrls: ['./news-page.component.scss'],
    providers: [Paginator],
    encapsulation: ViewEncapsulation.None,
})
export class NewsPageComponent implements OnInit, OnDestroy {
    @ViewChild(MatSort, {static: true}) matSort: MatSort;
    public dataSource: PaginatedDataTableSource<NewsArticle>;

    constructor(
        public paginator: Paginator<NewsArticle>,
        private news: NewsService,
        private modal: Modal,
        public currentUser: CurrentUser,
        public settings: Settings,
        public urls: TitleUrlsService,
        private toast: Toast,
    ) {}

    ngOnInit() {
        this.dataSource = new PaginatedDataTableSource<NewsArticle>({
            uri: 'news',
            dataPaginator: this.paginator,
            matSort: this.matSort
        });
    }

    ngOnDestroy() {
        this.paginator.destroy();
    }

    public deleteSelectedArticles() {
        const ids = this.dataSource.selectedRows.selected.map(title => title.id);

        this.news.delete({ids}).subscribe(() => {
            this.dataSource.reset();
            this.dataSource.selectedRows.clear();
            this.toast.open(MESSAGES.NEWS_DELETE_SUCCESS);
        });
    }

    public maybeDeleteSelectedArticles() {
        this.modal.show(ConfirmModalComponent, {
            title: 'Delete Articles',
            body:  'Are you sure you want to delete selected articles?',
            ok:    'Delete'
        }).afterClosed().subscribe(confirmed => {
            if ( ! confirmed) return;
            this.deleteSelectedArticles();
        });
    }
}
