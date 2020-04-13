import {Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy} from '@angular/core';
import {Modal} from '../../../../common/core/ui/dialogs/modal.service';
import {CrupdateReviewModalComponent} from '../crupdate-review-modal/crupdate-review-modal.component';
import {Review} from '../../../models/review';
import {Select, Store} from '@ngxs/store';
import {CrupdateReview, DeleteReview, LoadReviews} from '../../titles/state/title-actions';
import {TitleState} from '../../titles/state/title-state';
import {BehaviorSubject, Observable} from 'rxjs';
import {CurrentUser} from '../../../../common/auth/current-user';
import {ReviewScoreType} from './review-score-type.enum';
import {finalize} from 'rxjs/operators';
import {ReviewService} from '../../shared/review.service';
import {ConfirmModalComponent} from '../../../../common/core/ui/confirm-modal/confirm-modal.component';
import {Toast} from '../../../../common/core/ui/toast.service';
import {MESSAGES} from '../../../toast-messages';

@Component({
    selector: 'review-tab',
    templateUrl: './review-tab.component.html',
    styleUrls: ['./review-tab.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReviewTabComponent implements OnInit {
    @Select(TitleState.reviews) reviews$: Observable<Review[]>;
    public loading$ = new BehaviorSubject(false);

    constructor(
        private modal: Modal,
        private store: Store,
        public currentUser: CurrentUser,
        public reviews: ReviewService,
        private toast: Toast,
    ) {}

    ngOnInit() {
        this.loading$.next(true);
        this.store.dispatch(new LoadReviews())
            .pipe(finalize(() => this.loading$.next(false)))
            .subscribe();
    }

    public openCrupdateReviewModal() {
        const review = (this.store.selectSnapshot(TitleState.reviews) || [])
            .find(curr => curr.user_id === this.currentUser.get('id'));
        const mediaId = this.store.selectSnapshot(TitleState.title).id;
        this.modal.open(
            CrupdateReviewModalComponent,
            {review, mediaId},
            'crupdate-review-modal-container'
        ).beforeClosed().subscribe(newReview => {
            if (newReview) {
                this.store.dispatch(new CrupdateReview(newReview));
            }
        });
    }

    public maybeDeleteReview(review: Review) {
        this.modal.show(ConfirmModalComponent, {
            title: 'Delete Review',
            body:  'Are you sure you want to delete your review?',
            ok:    'Delete'
        }).afterClosed().subscribe(confirmed => {
            if ( ! confirmed) return;
            this.loading$.next(true);
            this.store.dispatch(new DeleteReview(review))
                .pipe(finalize(() => this.loading$.next(false)))
                .subscribe(() => this.toast.open(MESSAGES.REVIEW_DELETE_SUCCESS));
        });
    }

    public getScoreColor(score: number): ReviewScoreType {
        if (score < 5) {
            return ReviewScoreType.LOW;
        } else if (score < 7) {
            return ReviewScoreType.MEDIUM;
        } else {
            return ReviewScoreType.HIGH;
        }
    }
}
