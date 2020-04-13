import {Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, Inject} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {OVERLAY_PANEL_DATA} from '../../../../../../common/core/ui/overlay-panel/overlay-panel-data';
import {Episode} from '../../../../../models/episode';
import {Title} from '../../../../../models/title';
import {Review} from '../../../../../models/review';
import {ReviewService} from '../../../../shared/review.service';
import {OverlayPanelRef} from '../../../../../../common/core/ui/overlay-panel/overlay-panel-ref';
import {finalize} from 'rxjs/operators';
import {Store} from '@ngxs/store';
import {AddRating, RemoveRating} from '../../../../lists/user-lists/state/user-lists-state-actions';
import {FormControl} from '@angular/forms';

export interface StarRatingOverlayData {
    item: Episode|Title;
    userRating: Review;
}

@Component({
    selector: 'star-rating-overlay',
    templateUrl: './star-rating-overlay.component.html',
    styleUrls: ['./star-rating-overlay.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StarRatingOverlayComponent implements OnInit {
    public loading$ = new BehaviorSubject(false);
    public rating = new FormControl();

    constructor(
        @Inject(OVERLAY_PANEL_DATA) private data: StarRatingOverlayData,
        private overlayRef: OverlayPanelRef,
        private reviews: ReviewService,
        private store: Store,
    ) {}

    ngOnInit() {
        if (this.data.userRating) {
            this.rating.setValue(this.data.userRating.score, {emitEvent: false});
        }

        this.rating.valueChanges.subscribe(value => {
            if ( ! this.loading$.value) {
                this.rateItem(value);
            }
        });
    }

    public close() {
        this.overlayRef.close();
    }

    public rateItem(rating: number) {
        this.loading$.next(true);
        this.reviews.create({
            mediaId: this.data.item.id,
            mediaType: this.data.item.type,
            score: rating,
        }).pipe(finalize(() => this.loading$.next(false)))
        .subscribe(response => {
            this.data.userRating = response.review;
            this.store.dispatch(new AddRating(response.review));
            this.close();
        });
    }

    public deleteRating() {
        if ( ! this.data.userRating) {
            this.close();
        } else {
            this.loading$.next(true);
            this.reviews.delete([this.data.userRating.id])
                .pipe(finalize(() => this.loading$.next(false)))
                .subscribe(() => {
                    this.store.dispatch(new RemoveRating(this.data.userRating));
                    this.close();
                });
        }
    }
}
