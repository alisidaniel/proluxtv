import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {FormBuilder} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Toast} from '@common/core/ui/toast.service';
import {CssTheme} from '@common/core/types/models/CssTheme';
import {CssThemeService} from '@common/admin/appearance/panels/themes-appearance-panel/css-theme.service';

interface CrupdateCssThemeModalData {
    theme: CssTheme;
}

@Component({
    selector: 'crupdate-css-theme-modal',
    templateUrl: './crupdate-css-theme-modal.component.html',
    styleUrls: ['./crupdate-css-theme-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CrupdateCssThemeModalComponent {
    public loading$ = new BehaviorSubject(false);
    public errors$ = new BehaviorSubject<{[K in keyof Partial<CssTheme>]: string}>({});
    public form = this.fb.group({
        name: [''],
        is_dark: [false],
        default_dark: [false],
        default_light: [false],
    });

    constructor(
        private dialogRef: MatDialogRef<CrupdateCssThemeModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: CrupdateCssThemeModalData,
        private cssTheme: CssThemeService,
        private toast: Toast,
        private fb: FormBuilder,
    ) {
        if (data.theme) {
            this.form.patchValue(data.theme);
        }
    }

    public confirm() {
        const request = this.data.theme ?
            this.cssTheme.update(this.data.theme.id, this.form.value) :
            this.cssTheme.create(this.form.value);

        request.subscribe(response => {
            this.toast.open(this.data.theme ? 'Theme updated' : 'Theme created');
            this.close(response.theme);
        }, err => this.errors$.next(err.messages));
    }

    public close(theme?: CssTheme) {
        this.dialogRef.close(theme);
    }
}
