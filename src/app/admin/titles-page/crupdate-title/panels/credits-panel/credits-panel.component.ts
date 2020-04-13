import {
    Component,
    ViewEncapsulation,
    ChangeDetectionStrategy,
    Input,
    OnChanges,
    SimpleChange,
    ViewChild, OnInit
} from '@angular/core';
import {Store} from '@ngxs/store';
import {CrupdateTitleState} from '../../state/crupdate-title-state';
import {TitleCredit} from '../../../../../models/title';
import {Modal} from '../../../../../../common/core/ui/dialogs/modal.service';
import {CrupdateCreditModalComponent} from '../crupdate-credit-modal/crupdate-credit-modal.component';
import {ConfirmModalComponent} from '../../../../../../common/core/ui/confirm-modal/confirm-modal.component';
import {ChangeCreditOrder, RemoveCredit} from '../../state/crupdate-title-actions';
import {Toast} from '../../../../../../common/core/ui/toast.service';
import {MESSAGES} from '../../../../../toast-messages';
import {CdkDragDrop} from '@angular/cdk/drag-drop';
import {Person} from '../../../../../models/person';
import {MatSort, MatTableDataSource} from '@angular/material';
import {Creditable} from '../../../../../site/people/creditable';

@Component({
    selector: 'credits-panel',
    templateUrl: './credits-panel.component.html',
    styleUrls: ['./credits-panel.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreditsPanelComponent implements OnChanges, OnInit {
    @ViewChild(MatSort, {static: true}) matSort: MatSort;
    @Input() mediaItem: Creditable;
    @Input() type: 'cast'|'crew';

    public castColumns = ['person', 'character', 'edit'];
    public crewColumns = ['person', 'department', 'job', 'edit'];
    public dataSource = new MatTableDataSource();

    constructor(
        private dialog: Modal,
        private store: Store,
        private toast: Toast,
    ) {}

    ngOnInit () {
        this.dataSource.sort = this.matSort;
        this.dataSource.sortingDataAccessor = (item: TitleCredit, property) => {
            switch (property) {
                case 'person':
                    return item.name;
                default:
                    return item.pivot[property];
            }
        };
    }

    ngOnChanges(changes: {mediaItem?: SimpleChange}) {
        if (changes.mediaItem && changes.mediaItem.currentValue) {
            this.dataSource.data = this.type === 'cast' ?
                this.getCast(this.mediaItem.credits) :
                this.getCrew(this.mediaItem.credits);
        }
    }

    public openCrupdateCreditModal(credit?: TitleCredit) {
        this.dialog.open(
            CrupdateCreditModalComponent,
            {credit, type: this.type, mediaItem: this.mediaItem}
        );
    }

    public detachCredit(credit: TitleCredit) {
        this.dialog.open(ConfirmModalComponent, {
            title: 'Remove Credit',
            body:  'Are you sure you want to remove this credit?',
            ok:    'Remove'
        }).afterClosed().subscribe(confirmed => {
            if ( ! confirmed) return;
            this.store.dispatch(new RemoveCredit(this.mediaItem, credit)).subscribe(() => {
                this.toast.open(MESSAGES.CREDIT_REMOVE_SUCCESS);
            });
        });
    }

    public changeCreditsOrder(e: CdkDragDrop<Person>) {
        if (this.store.selectSnapshot(CrupdateTitleState.loading)) return;
        this.store.dispatch(new ChangeCreditOrder(this.mediaItem, e.previousIndex, e.currentIndex));
    }

    public applyFilter(value: string) {
        this.dataSource.filter = value;
    }

    public getCast(credits: TitleCredit[]) {
        if ( ! credits) return [];
        return credits.filter(credit => credit.pivot.department === 'cast');
    }

    public getCrew(credits: TitleCredit[]) {
        if ( ! credits) return [];
        return credits.filter(credit => credit.pivot.department !== 'cast');
    }
}
