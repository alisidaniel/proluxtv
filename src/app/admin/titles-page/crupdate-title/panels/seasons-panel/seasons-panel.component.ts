import {Component, ViewEncapsulation, ChangeDetectionStrategy} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {CrupdateTitleState} from '../../state/crupdate-title-state';
import {Observable} from 'rxjs';
import {Season} from '../../../../../models/season';
import {TitleCredit} from '../../../../../models/title';
import {CreateSeason, DeleteEpisode, DeleteSeason} from '../../state/crupdate-title-actions';
import {Modal} from '../../../../../../common/core/ui/dialogs/modal.service';
import {ConfirmModalComponent} from '../../../../../../common/core/ui/confirm-modal/confirm-modal.component';
import {MESSAGES} from '../../../../../toast-messages';
import {Toast} from '../../../../../../common/core/ui/toast.service';

@Component({
    selector: 'seasons-panel',
    templateUrl: './seasons-panel.component.html',
    styleUrls: ['./seasons-panel.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SeasonsPanelComponent {
    @Select(CrupdateTitleState.seasons) seasons$: Observable<Season[]>;
    @Select(CrupdateTitleState.loading) loading$: Observable<boolean>;

    constructor(
        private store: Store,
        private modal: Modal,
        private toast: Toast,
    ) {}

    public addSeason() {
        this.store.dispatch(new CreateSeason()).subscribe(() => {
            this.toast.open(MESSAGES.SEASON_CREATE_SUCCESS);
        });
    }

    public maybeDeleteSeason(season: Season) {
        this.modal.open(ConfirmModalComponent, {
            title: 'Delete Season',
            body:  'Are you sure you want to delete this season?',
            bodyBold: 'This will also delete all episodes attached to this season.',
            ok:    'Delete'
        }).afterClosed().subscribe(confirmed => {
            if ( ! confirmed) return;
            this.store.dispatch(new DeleteSeason(season)).subscribe(() => {
                this.toast.open(MESSAGES.SEASON_DELETE_SUCCESS);
            });
        });
    }

    trackByFn(index: number, season: Season) {
        return season.id;
    }
}
