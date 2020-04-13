import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {finalize} from 'rxjs/operators';
import {CurrentUser} from '@common/auth/current-user';
import {User} from '@common/core/types/models/User';
import {Users} from '@common/auth/users.service';
import {Toast} from '@common/core/ui/toast.service';
import {BehaviorSubject} from 'rxjs';
import {FormBuilder} from '@angular/forms';

export interface CrupdateUserModalData {
    user?: User;
}

@Component({
    selector: 'crupdate-user-modal',
    templateUrl: './crupdate-user-modal.component.html',
    styleUrls: ['./crupdate-user-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CrupdateUserModalComponent implements OnInit {
    public loading$ = new BehaviorSubject<boolean>(false);
    public form = this.fb.group({
        email: [''],
        password: [''],
        avatar: [''],
        first_name: [''],
        last_name: [''],
        confirmed: [''],
        available_space: [''],
        roles: [],
        permissions: [],
    });
    public errors$ = new BehaviorSubject<Partial<User>>({});

    constructor(
        private dialogRef: MatDialogRef<CrupdateUserModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: CrupdateUserModalData,
        public users: Users,
        private toast: Toast,
        public currentUser: CurrentUser,
        private fb: FormBuilder,
    ) {}

    ngOnInit() {
        this.resetState();
        if (this.data.user) {
            this.form.patchValue(this.data.user);
        }
    }
    
    public confirm() {
        if (this.loading$.value) return;
        let request;
        const payload = this.getPayload();

        this.loading$.next(true);

        if (this.data.user) {
            request = this.users.update(this.data.user.id, payload);
        } else {
            request = this.users.create(payload);
        }

        request.pipe(finalize(() => this.loading$.next(false)))
            .subscribe(response => {
                this.close(response.user);
                const action = this.data.user ? 'updated' : 'created';
                this.toast.open('User ' + action);
            }, err => this.errors$.next(err.messages));
    }
    
    public close(data?: any) {
        this.resetState();
        this.dialogRef.close(data);
    }
    
    private getPayload() {
        const payload = {...this.form.value};
        payload.roles = (payload.roles || []).map(role => role.id);
        if ( ! payload.password) {
            delete payload.password;
        }
        return payload;
    }
    
    private resetState() {
        this.form.reset();
        this.errors$.next({});
    }
}
