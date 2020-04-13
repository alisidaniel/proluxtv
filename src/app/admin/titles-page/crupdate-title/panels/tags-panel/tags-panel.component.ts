import {Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, Input, ViewChild} from '@angular/core';
import {Tag} from '../../../../../../common/core/types/models/Tag';
import {Select, Store} from '@ngxs/store';
import {CrupdateTitleState} from '../../state/crupdate-title-state';
import {Observable} from 'rxjs';
import {MatSort, MatTableDataSource} from '@angular/material';
import {Modal} from '../../../../../../common/core/ui/dialogs/modal.service';
import {CrupdateTagModalComponent} from './crupdate-tag-modal/crupdate-tag-modal.component';
import {CreateTag, DetachTag} from '../../state/crupdate-title-actions';
import {Toast} from '../../../../../../common/core/ui/toast.service';
import {MESSAGES} from '../../../../../toast-messages';

@Component({
    selector: 'tags-panel',
    templateUrl: './tags-panel.component.html',
    styleUrls: ['./tags-panel.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TagsPanelComponent implements OnInit {
    @ViewChild(MatSort, {static: true}) matSort: MatSort;
    @Input() type: 'keyword' | 'genre';
    @Input() displayType: string;
    @Select(CrupdateTitleState.keywords) tags: Observable<Tag[]>;
    public dataSource = new MatTableDataSource();

    constructor(
        private store: Store,
        private modal: Modal,
        private toast: Toast,
    ) {}

    ngOnInit() {
        this.dataSource.sort = this.matSort;
        const tags$ = this.getTagObservable();

        tags$.subscribe(tags => {
            this.dataSource.data = tags || [];
        });
    }

    public openCrupdateCreditModal(tag?: Tag) {
        this.modal.open(
            CrupdateTagModalComponent,
            {tag},
            {panelClass: 'crupdate-tag-modal-container'}
        ).beforeClosed().subscribe(newTag => {
           if (newTag) {
               newTag.type = this.type;
               this.store.dispatch(new CreateTag(newTag));
           }
        });
    }

    public detachTag(tag: Tag) {
        this.store.dispatch(new DetachTag(tag))
            .subscribe(() => {
                this.toast.open(MESSAGES.TAG_DETACH_SUCCESS);
            });
    }

    public applyFilter(value: string) {
        this.dataSource.filter = value;
    }

    private getTagObservable() {
        if (this.type === 'keyword') {
            return this.store.select(CrupdateTitleState.keywords);
        } else if (this.type === 'genre') {
            return this.store.select(CrupdateTitleState.genres);
        } else {
            return this.store.select(CrupdateTitleState.countries);
        }
    }
}
