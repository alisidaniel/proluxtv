import {Component, ViewEncapsulation, ChangeDetectionStrategy, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {TitleCredit} from '../../../../../models/title';
import {Observable} from 'rxjs';
import {FormBuilder} from '@angular/forms';
import {Actions, Select, Store} from '@ngxs/store';
import {AddCredit, UpdateCredit} from '../../state/crupdate-title-actions';
import {Toast} from '../../../../../../common/core/ui/toast.service';
import {MESSAGES} from '../../../../../toast-messages';
import {CrupdateTitleState} from '../../state/crupdate-title-state';
import {MEDIA_TYPE} from '../../../../../site/media-type';
import {Creditable} from '../../../../../site/people/creditable';

interface CrupdateCreditModalData {
    credit?: TitleCredit;
    type: 'cast'|'crew';
    mediaItem: Creditable;
}

@Component({
    selector: 'crupdate-credit-modal',
    templateUrl: './crupdate-credit-modal.component.html',
    styleUrls: ['./crupdate-credit-modal.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CrupdateCreditModalComponent {
    @Select(CrupdateTitleState.loading) loading$: Observable<boolean>;
    public credit: TitleCredit;

    public form = this.fb.group({
        character: [''],
        department: [''],
        job: [''],
    });

    constructor(
        private store: Store,
        private toast: Toast,
        private fb: FormBuilder,
        private actions$: Actions,
        private dialogRef: MatDialogRef<CrupdateCreditModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: CrupdateCreditModalData,
    ) {
        if (this.data.credit) {
            this.credit = this.data.credit;
            this.form.patchValue(this.data.credit.pivot);
        }
    }

    public confirm() {
        const action = this.data.credit
            ? new UpdateCredit(this.credit.pivot.id, this.getPayload())
            : new AddCredit(this.credit.id, this.data.mediaItem, this.getPayload());

        this.store.dispatch(action).subscribe(() => {
            this.close();
            this.toast.open(this.data.credit ? MESSAGES.CREDIT_UPDATE_SUCCESS : MESSAGES.CREDIT_ADD_SUCCESS);
        });
    }

    public close() {
        this.dialogRef.close();
    }

    public setCredit(credit: TitleCredit) {
        this.credit = credit;
    }

    private getPayload() {
        const payload = this.form.value;
        if (this.data.type === 'cast') {
            payload.department = 'cast';
            payload.job = 'cast';
        }
        return payload;
    }

    public getPersonType() {
        return MEDIA_TYPE.PERSON;
    }
}
