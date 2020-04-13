import {ChangeDetectionStrategy, Component} from '@angular/core';
import {SocialAuthService} from '../social-auth.service';
import {AuthService} from '../auth.service';
import {Router} from '@angular/router';
import {CurrentUser} from '../current-user';
import {Bootstrapper} from '../../core/bootstrapper.service';
import {Settings} from '../../core/config/settings.service';
import {FormBuilder} from '@angular/forms';
import {BehaviorSubject} from 'rxjs';

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
    public loading$ = new BehaviorSubject<boolean>(false);
    public form = this.fb.group({
        email: [''],
        password: [''],
        remember: [true],
    });

    public errors$ = new BehaviorSubject<{
        email?: string,
        password?: string,
        general?: string
    }>({});

    constructor(
        public auth: AuthService,
        public socialAuth: SocialAuthService,
        public settings: Settings,
        private router: Router,
        private user: CurrentUser,
        private bootstrapper: Bootstrapper,
        private fb: FormBuilder,
    ) {
        this.hydrateModel();
    }

    public login() {
        this.loading$.next(true);
        this.auth.login(this.form.value)
            .subscribe(response => {
                this.bootstrapper.bootstrap(response.data);
                this.router.navigate([this.auth.getRedirectUri()]).then(() => {
                    this.loading$.next(false);
                });
            }, err => {
                this.errors$.next(err.messages);
                this.loading$.next(false);
            });
    }

    private hydrateModel() {
        if ( ! this.settings.get('common.site.demo')) return;

        if (this.settings.get('vebto.demo.email')) {
            this.form.patchValue({
                email: this.settings.get('vebto.demo.email'),
                password: this.settings.get('vebto.demo.password'),
            });
        } else {
            // random number between 0 and 100, padded to 3 digits
            let number = '' + Math.floor(Math.random() * 100);
            number = ('0000' + number).substr(-3, 3);

            this.form.patchValue({
                email: 'admin@demo' + number + '.com',
                password: 'admin'
            });
        }
    }
}
