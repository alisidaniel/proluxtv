import {OnDestroy} from '@angular/core';
import {SettingsState} from './settings-state.service';
import {ActivatedRoute} from '@angular/router';
import {finalize} from 'rxjs/operators';
import {Settings} from '../../core/config/settings.service';
import {Toast} from '../../core/ui/toast.service';
import {Modal} from '../../core/ui/dialogs/modal.service';
import {CustomHomepage} from '../../core/pages/shared/custom-homepage.service';
import {AppHttpClient} from '../../core/http/app-http-client.service';
import {ArtisanService} from '../artisan.service';
import {SettingsPayload} from '../../core/config/settings-payload';
import {BehaviorSubject} from 'rxjs';
import {ValueLists} from '@common/core/services/value-lists.service';

export abstract class SettingsPanelComponent implements OnDestroy {
    public loading$ = new BehaviorSubject<boolean>(false);
    public errors$ = new BehaviorSubject<{[key: string]: string}>({});

    constructor(
        public settings: Settings,
        protected toast: Toast,
        protected http: AppHttpClient,
        protected modal: Modal,
        protected route: ActivatedRoute,
        protected artisan: ArtisanService,
        protected customHomepage: CustomHomepage,
        protected valueLists: ValueLists,
        public state: SettingsState,
    ) {}

    ngOnDestroy() {
        this.state.reset();
    }

    public setJson(name: string, value: string[]|number[]) {
        this.state.client[name] = JSON.stringify(value);
    }

    public getJson(name: string): any[] {
        const value = this.state.client[name];
        if ( ! value) return value;
        return JSON.parse(value);
    }

    public saveSettings(settings?: SettingsPayload) {
        this.loading$.next(true);
        const changedSettings = settings || this.state.getModified();
        this.settings.save(changedSettings)
            .pipe(finalize(() => this.loading$.next(false)))
            .subscribe(() => {
                this.toast.open('Settings saved.');
                this.clearErrors();
                // update initial settings after saving, so
                // so new setting state is not lost when
                // navigating between setting panels
                this.state.updateInitial(changedSettings);
            }, errResponse => {
                this.errors$.next(errResponse.messages);
                this.scrollInvalidInputIntoView();
            });
    }

    public clearErrors() {
        this.errors$.next({});
    }

    private scrollInvalidInputIntoView() {
        const firstKey = Object.keys(this.errors$.value)[0];
        if (firstKey) {
            const node = document.getElementById(firstKey);
            if (node) {
                node.scrollIntoView({behavior: 'smooth', block: 'center', inline: 'center'});
            }
        }
    }
}
