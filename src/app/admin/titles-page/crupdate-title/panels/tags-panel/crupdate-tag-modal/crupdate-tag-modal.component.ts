import {Component, ViewEncapsulation, ChangeDetectionStrategy, Inject} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {FormBuilder} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {MEDIA_TYPE} from '../../../../../../site/media-type';
import {Tag} from '../../../../../../../common/core/types/models/Tag';

interface CrupdateTagModalData {
    tag?: Tag;
}

@Component({
    selector: 'crupdate-tag-modal',
    templateUrl: './crupdate-tag-modal.component.html',
    styleUrls: ['./crupdate-tag-modal.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CrupdateTagModalComponent {
    public loading$ = new BehaviorSubject(false);
    public tagForm = this.fb.group({
        name: [],
        display_name: [],
    });

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<CrupdateTagModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: CrupdateTagModalData,
    ) {
        this.hydrateForm();
    }

    public confirm() {
        this.close(this.tagForm.value);
    }

    public close(tag?: Tag) {
        this.dialogRef.close(tag);
    }

    private hydrateForm() {
        if (this.data.tag) {
            this.tagForm.patchValue(this.data.tag);
        }
    }
}
