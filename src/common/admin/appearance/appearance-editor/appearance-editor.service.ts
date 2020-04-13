import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {AppearanceEditorConfig, AppearanceEditorField} from '@common/core/config/app-config';
import {Settings} from '@common/core/config/settings.service';
import {Deselect, Navigate, Select, SetConfig} from '@common/shared/appearance/commands/appearance-commands';
import {AppearanceCommand} from '@common/shared/appearance/commands/appearance-command';
import {APPEARANCE_TOKEN} from '@common/shared/appearance/appearance-listener.service';
import {BehaviorSubject, fromEvent, Observable, ReplaySubject} from 'rxjs';
import {filter, finalize, share} from 'rxjs/operators';
import {slugifyString} from '@common/core/utils/slugify-string';
import {CssThemeColors} from '@common/core/types/models/CssTheme';
import {AppHttpClient} from '@common/core/http/app-http-client.service';
import {Toast} from '@common/core/ui/toast.service';

export interface EditorChanges {
    [key: string]: string|number|object;
    colors?: CssThemeColors;
}

@Injectable({
    providedIn: 'root'
})
export class AppearanceEditor {
    public activePanel$ = new BehaviorSubject<AppearanceEditorField>(null);
    public defaultSettings: {[key: string]: any} = {};
    public config: Partial<AppearanceEditorConfig> = {};
    public initiated$ = new ReplaySubject(1);
    private previewWindow: Window;

    public loading$ = new BehaviorSubject<boolean>(false);
    private saveRequest: (changes: EditorChanges) => Observable<void>;
    public changes$ = new BehaviorSubject<EditorChanges>(null);

    constructor(
        private settings: Settings,
        private router: Router,
        private http: AppHttpClient,
        private toast: Toast,
    ) {}

    public addChanges(value: EditorChanges) {
        this.changes$.next({...this.changes$.value, ...value});
    }
    
    public openPanel(name: string) {
        const panel = this.config.sections.find(value => {
            return slugifyString(value.name) === name;
        });
        this.activePanel$.next(panel);
    }

    public init(iframe: HTMLIFrameElement, defaultSettings: {name: string, value: any}[]) {
        // listen for 'initiated' event from iframe window
        fromEvent(window, 'message')
            .pipe(filter((e: MessageEvent) => {
                return e.data === APPEARANCE_TOKEN && (new URL(e.origin).hostname) === window.location.hostname;
            })).subscribe(() => {
                this.initiated$.next(true);
                this.initiated$.complete();
            });

        defaultSettings.forEach(setting => {
            if (setting.name === 'env') {
                this.defaultSettings = {...this.defaultSettings, ...setting.value};
            } else {
                this.defaultSettings[setting.name] = setting.value;
            }
        });

        this.initConfig();
        this.initIframe(iframe);
    }

    public saveChanges(changes?: EditorChanges): Observable<void> {
        if (changes) {
            this.addChanges(changes);
        }
        this.loading$.next(true);
        const request = this.saveRequest ?
            this.saveRequest :
            c => this.http.post('admin/appearance', c);
        const observable = request(this.changes$.value)
            .pipe(finalize(() => this.loading$.next(false)), share());
            observable.subscribe(() => {
                this.changes$.next(null);
                this.toast.open('Appearance saved');
            });
        return observable;
    }

    public setSaveRequest(request: (changes: EditorChanges) => Observable<void>) {
        this.saveRequest = request;
    }

    public closeActivePanel() {
        this.router.navigate(['/admin/appearance']);
        this.navigate();
    }

    public navigate(route?: string) {
        if ( ! route) route = this.config.defaultRoute;
        this.postMessage(new Navigate(route));
    }

    public setConfig(key: string, value: string|number) {
        this.postMessage(new SetConfig(key, value));
    }

    public selectNode(selector: string, index = 0) {
        if ( ! selector) return;
        this.postMessage(new Select(selector, index));
    }

    public deselectNode() {
        this.postMessage(new Deselect());
    }

    public postMessage(command: AppearanceCommand) {
        this.previewWindow.postMessage(command, '*');
    }

    public currentValue(key: string) {
        if (key.startsWith('env.') || key.startsWith('custom_code.')) {
            return this.defaultSettings[key];
        } else {
            return this.settings.get(key);
        }
    }

    private initConfig() {
        const config = this.settings.get('vebto.admin.appearance');
        config.sections = config.sections.sort((a, b) => (a.position > b.position) ? 1 : -1);
        if ( ! config.defaultRoute) config.defaultRoute = '/';
        this.config = config;
    }

    private initIframe(iframe: HTMLIFrameElement) {
        iframe.src = this.settings.getBaseUrl() + this.config.defaultRoute + `?be-preview-mode=${APPEARANCE_TOKEN}`;
        this.previewWindow = iframe.contentWindow;
    }
}
