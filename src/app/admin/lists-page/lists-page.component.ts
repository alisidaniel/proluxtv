import {Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, ViewChild, OnDestroy} from '@angular/core';
import {MatSort} from '@angular/material';
import {TitleUrlsService} from '../../site/titles/title-urls.service';
import {ListsService} from '../../site/lists/lists.service';
import {List} from '../../models/list';
import {PaginatedDataTableSource} from '@common/shared/data-table/data/paginated-data-table-source';
import {Modal} from '@common/core/ui/dialogs/modal.service';
import {CurrentUser} from '@common/auth/current-user';
import {Paginator} from '@common/shared/paginator.service';
import {Settings} from '@common/core/config/settings.service';
import {ConfirmModalComponent} from '@common/core/ui/confirm-modal/confirm-modal.component';

@Component({
    selector: 'lists-page',
    templateUrl: './lists-page.component.html',
    styleUrls: ['./lists-page.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [Paginator],
})
export class ListsPageComponent implements OnInit, OnDestroy {
    @ViewChild(MatSort, {static: true}) matSort: MatSort;
    public dataSource: PaginatedDataTableSource<List>;

    constructor(
        public paginator: Paginator<List>,
        private lists: ListsService,
        private modal: Modal,
        public currentUser: CurrentUser,
        public settings: Settings,
        public urls: TitleUrlsService,
    ) {}

    ngOnInit() {
        this.dataSource = new PaginatedDataTableSource<List>({
            uri: 'lists',
            dataPaginator: this.paginator,
            matSort: this.matSort,
            staticParams: {
                excludeSystem: true,
                with: 'user',
                withCount: 'items',
            }
        });
    }

    ngOnDestroy() {
        this.paginator.destroy();
    }

    public deleteSelectedLists() {
        const ids = this.dataSource.getSelectedItems();
        this.lists.delete(ids).subscribe(() => {
            this.dataSource.reset();
            this.dataSource.selectedRows.clear();
        });
    }

    public maybeDeleteSelectedLists() {
        this.modal.show(ConfirmModalComponent, {
            title: 'Delete Lists',
            body:  'Are you sure you want to delete selected lists?',
            ok:    'Delete'
        }).afterClosed().subscribe(confirmed => {
            if ( ! confirmed) return;
            this.deleteSelectedLists();
        });
    }
}
