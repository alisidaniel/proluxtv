import {Injectable, Injector} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Settings} from './config/settings.service';
import {Translations} from './translations/translations.service';
import {APP_CONFIG, AppConfig} from './config/app-config';
import {Role} from './types/models/Role';
import {User} from './types/models/User';
import {LocalizationWithLines} from './types/localization-with-lines';
import {CurrentUser} from '../auth/current-user';
import {AppearanceListenerService} from '../shared/appearance/appearance-listener.service';
import {ThemeService} from '@common/core/theme.service';

export function init_app(bootstrapper: Bootstrapper) {
    return () => bootstrapper.bootstrap();
}

export interface BootstrapData {
    settings: AppConfig;
    guests_role: Role|null;
    user: User|null;
    i18n?: LocalizationWithLines;
    [key: string]: any;
}

@Injectable()
export class Bootstrapper {
    protected http: HttpClient;
    protected settings: Settings;
    protected currentUser: CurrentUser;
    protected i18n: Translations;
    public data: BootstrapData;

    constructor(protected injector: Injector) {
        this.http = this.injector.get(HttpClient);
        this.settings = this.injector.get(Settings);
        this.currentUser = this.injector.get(CurrentUser);
        this.i18n = this.injector.get(Translations);

        // merge all config provided by modules into single object
        this.injector.get(APP_CONFIG).forEach(providedConfig => {
            return this.settings.merge({vebto: providedConfig});
        });
    }

    /**
     * Bootstrap application with data returned from server.
     */
    public bootstrap(data?: string): Promise<any> {
        if ( ! data) data = window['bootstrapData'];

        // if we have bootstrap data in global scope, pass
        // it to the app and return self resolving promise
        if (data) {
            this.handleData(data);
            return new Promise(resolve => resolve());
        }

        // fetch bootstrap data from backend and return promise that
        // resolves once request is complete and data is passed to the app
        return new Promise((resolve, reject) => {
            const original  = encodeURIComponent(window.location.href);
            const url = this.settings.getBaseUrl() + 'secure/bootstrap-data?original_url=' + original;
            this.http.get(url).subscribe(response => {
                this.handleData(response['data']);
                resolve();
            }, error => {
                console.log('bootstrap error', error);
                reject();
            });
        });
    }

    /**
     * Handle specified bootstrap data.
     */
    protected handleData(encodedData: string): BootstrapData {
        // decode bootstrap data from server
        const data = JSON.parse(atob(encodedData)) as BootstrapData;

        // set all settings returned from server
        this.settings.setMultiple(data.settings);

        // set translations
        if (data.i18n) {
            this.i18n.setLocalization(data.i18n);
        }

        // set current user and default role for guests
        this.currentUser.init({
            guestsRole: data.guests_role,
            user: data.user,
        });

        this.data = data;

        const themes = this.injector.get(ThemeService);
        if (window['beThemes']) {
            // default theme will be set via PHP, make sure we don't double set it on production
            themes.selectedTheme$.next(window['beThemes'][window['beSelectedTheme']]);
            themes.registerThemes(window['beThemes']);
        } else {
            this.injector.get(ThemeService).registerThemes(this.data.themes);
        }

        // init appearance listener after default theme is set
        this.injector.get(AppearanceListenerService).init();

        return data;
    }
}
