import {Injectable} from '@angular/core';
import {CssTheme} from '@common/core/types/models/CssTheme';
import {BehaviorSubject} from 'rxjs';
import {LocalStorage} from '@common/core/services/local-storage.service';
import {Settings} from '@common/core/config/settings.service';
import {slugifyString} from '@common/core/utils/slugify-string';

type ThemeNames = 'dark' | 'light';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    public selectedTheme$ = new BehaviorSubject<CssTheme>(null);
    private rootEl: HTMLElement;
    private registeredThemes: { dark: CssTheme, light: CssTheme };

    constructor(private localStorage: LocalStorage, private settings: Settings) {
        this.rootEl = document.documentElement;
    }

    public registerThemes(themes: { dark: CssTheme, light: CssTheme }) {
        this.registeredThemes = themes;
        if ( ! this.selectedTheme$.value) {
            this.select(this.getPreferredTheme());
        }
    }

    public select(name: ThemeNames) {
        const theme = this.registeredThemes[name];
        this.selectedTheme$.next(theme);
        this.setPreferredTheme(name);
        if (theme.is_dark) {
            this.rootEl.classList.add('be-dark-mode');
        } else {
            this.rootEl.classList.remove('be-dark-mode');
        }
        Object.entries(theme.colors).forEach(([key, value]) => {
            this.rootEl.style.setProperty(key, value);
        });
    }

    public toggle() {
        if (this.selectedTheme$.value.is_dark) {
            this.select('light');
        } else {
            this.select('dark');
        }
    }
    
    private getPreferredTheme(): ThemeNames {
        const defaultMode = this.settings.get('themes.default_mode', 'light');
        if (this.settings.get('themes.user_change')) {
            return this.localStorage.get(this.storageKey()) || defaultMode;
        } else {
            return defaultMode;
        }
    }
    
    private setPreferredTheme(name: ThemeNames) {
        this.localStorage.set(this.storageKey(), name);
    }
    
    private storageKey() {
        return slugifyString(this.settings.get('branding.site_name')) + '.theme';
    }
}
