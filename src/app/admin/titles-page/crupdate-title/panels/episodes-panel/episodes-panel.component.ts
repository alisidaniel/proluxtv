import {
    ChangeDetectionStrategy,
    Component,
    Input,
    OnChanges,
    OnInit,
    SimpleChange,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import {Episode} from '../../../../../models/episode';
import {DeleteEpisode} from '../../state/crupdate-title-actions';
import {MESSAGES} from '../../../../../toast-messages';
import {CrupdateEpisodeModalComponent} from '../seasons-panel/crupdate-episode-modal/crupdate-episode-modal.component';
import {Store} from '@ngxs/store';
import {MatSort, MatTableDataSource} from '@angular/material';
import {Season} from '../../../../../models/season';
import {Modal} from '@common/core/ui/dialogs/modal.service';
import {Toast} from '@common/core/ui/toast.service';
import {ConfirmModalComponent} from '@common/core/ui/confirm-modal/confirm-modal.component';

@Component({
    selector: 'episodes-panel',
    templateUrl: './episodes-panel.component.html',
    styleUrls: ['./episodes-panel.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EpisodesPanelComponent implements OnInit, OnChanges {
    @ViewChild(MatSort, {static: true}) matSort: MatSort;
    @Input() season: Season;
    public dataSource = new MatTableDataSource([]);

    public trackByFn = (i: number, episode: Episode) => episode.id;

    constructor(
        private store: Store,
        private dialog: Modal,
        private toast: Toast,
    ) {}

    ngOnInit () {
        this.dataSource.sort = this.matSort;
    }

    ngOnChanges(changes: {season?: SimpleChange}) {
        if (changes.season.currentValue && changes.season.currentValue.episodes) {
            this.dataSource.data = this.season.episodes;
        }
    }

    public deleteEpisode(episode: Episode) {
        this.dialog.open(ConfirmModalComponent, {
            title: 'Delete Episode',
            body:  'Are you sure you want to delete this episode?',
            ok:    'Delete'
        }).afterClosed().subscribe(confirmed => {
            if ( ! confirmed) return;
            this.store.dispatch(new DeleteEpisode(episode)).subscribe(() => {
                this.toast.open(MESSAGES.EPISODE_DELETE_SUCCESS);
            });
        });
    }

    public openCrupdateEpisodeModal(episode?: Episode) {
        this.dialog.open(
            CrupdateEpisodeModalComponent,
            {episode, season: this.season},
            {panelClass: 'crupdate-episode-modal-container'}
        );
    }

    public applyFilter(value: string) {
        this.dataSource.filter = value;
    }
}
