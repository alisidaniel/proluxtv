import {ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {MatSort} from '@angular/material';
import {Store} from '@ngxs/store';
import {CrupdateTitleState} from '../../state/crupdate-title-state';
import {Review} from '../../../../../models/review';
import {CrupdateReviewModalComponent} from '../../../../../site/reviews/crupdate-review-modal/crupdate-review-modal.component';
import {ReviewService} from '../../../../../site/shared/review.service';
import {PaginatedDataTableSource} from '@common/shared/data-table/data/paginated-data-table-source';
import {Modal} from '@common/core/ui/dialogs/modal.service';
import {Toast} from '@common/core/ui/toast.service';
import {CurrentUser} from '@common/auth/current-user';
import {Paginator} from '@common/shared/paginator.service';
import {ConfirmModalComponent} from '@common/core/ui/confirm-modal/confirm-modal.component';

@Component({
    selector: 'reviews-panel',
    templateUrl: './reviews-panel.component.html',
    styleUrls: ['./reviews-panel.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [Paginator],
})
export class ReviewsPanelComponent implements OnInit, OnDestroy {
    @ViewChild(MatSort, {static: true}) matSort: MatSort;
    public dataSource: PaginatedDataTableSource<Review>;

    constructor(
        private store: Store,
        private modal: Modal,
        private toast: Toast,
        private reviews: ReviewService,
        public paginator: Paginator<Review>,
        public currentUser: CurrentUser,
    ) {
        paginator.dontUpdateQueryParams = true;
    }

    ngOnInit() {
        const title =  this.store.selectSnapshot(CrupdateTitleState.title);
        this.dataSource = new PaginatedDataTableSource<Review>({
            uri: 'reviews',
            dataPaginator: this.paginator,
            matSort: this.matSort,
            staticParams: {compact: true, titleId: title.id},
        });
    }

    ngOnDestroy() {
        this.paginator.destroy();
    }

    public openCrupdateReviewModal(review?: Review) {
        const mediaId = this.store.selectSnapshot(CrupdateTitleState.title).id;
        this.modal.open(
            CrupdateReviewModalComponent,
            {review, mediaId},
            {panelClass: 'crupdate-review-modal-container'}
        ).beforeClosed().subscribe(newReview => {
            if (newReview) {
                this.dataSource.reset();
            }
        });
    }

    public maybeDeleteSelectedReviews() {
        this.modal.show(ConfirmModalComponent, {
            title: 'Delete Reviews',
            body:  'Are you sure you want to delete selected reviews?',
            ok:    'Delete'
        }).beforeClosed().subscribe(confirmed => {
            if ( ! confirmed) return;
            const ids = this.dataSource.getSelectedItems();
            this.reviews.delete(ids).subscribe(() => {
                this.dataSource.reset();
            });
        });
    }
}
