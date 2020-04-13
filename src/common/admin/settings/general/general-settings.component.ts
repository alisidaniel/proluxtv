import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {SettingsPanelComponent} from '../settings-panel.component';
import {FormControl} from '@angular/forms';
import {map, startWith} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {CustomPage} from '@common/core/types/models/CustomPage';
import {Route} from '@angular/router';
import {CssTheme} from '@common/core/types/models/CssTheme';

@Component({
    selector: 'homepage-settings',
    templateUrl: './general-settings.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {'class': 'settings-panel'},
})
export class GeneralSettingsComponent extends SettingsPanelComponent implements OnInit {
    private customPages: CustomPage[] = [];
    public cssThemes: CssTheme[] = [];
    public filteredCustomPages: Observable<CustomPage[]>;
    public customPageSearch = new FormControl();

    ngOnInit() {
        this.setHomepageValue();

        this.valueLists.get(['pages', 'themes'], {pageType: 'default'}).subscribe(response => {
            this.customPages = response.pages;
            this.cssThemes = response.themes;

            const page = this.customPages.find(
                customPage => customPage.id === +this.state.initial.client['homepage.value']
            );

            this.customPageSearch.setValue(page ? page.slug : '');

            this.filteredCustomPages = this.customPageSearch.valueChanges.pipe(
                startWith(''),
                map(val => this.filterPages(val))
            );
        });
    }

    public saveSettings() {
        const settings = this.state.getModified();

        if (this.state.client['homepage.type'] === 'page' && this.customPageSearch.value) {
            const page = this.customPages.find(
                customPage => customPage.slug === this.customPageSearch.value
            );
            if (page && (+this.state.initial.client['homepage.value'] !== page.id)) {
                settings.client['homepage.value'] = page.id;
            }
        }

        super.saveSettings(settings);
    }

    public getHomepageComponents() {
        return this.customHomepage.getComponents();
    }

    private filterPages(query: string) {
        return this.customPages.filter(page => {
            return (page.slug || '').toLowerCase().includes(query.toLowerCase()) ||
                (page.title || '').toLowerCase().includes(query.toLowerCase());
        });
    }

    public getDisplayName(route: Route) {
        return (route.data && route.data.name) || route.path.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }

    public setHomepageValue() {
        if (this.state.client['homepage.type'] === 'component') {
            const current = this.state.client['homepage.value'];
            if (!current || typeof current !== 'string') {
                this.state.client['homepage.value'] = this.customHomepage.getComponents()[0].path;
            }
        } else if (this.state.client['homepage.type'] === 'page') {
            //
        } else {
            this.state.client['homepage.value'] = null;
        }
    }
}
