import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {SettingsPanelComponent} from '../settings-panel.component';
import {LocalizationWithLines} from '@common/core/types/localization-with-lines';

@Component({
    selector: 'localization-settings',
    templateUrl: './localization-settings.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {'class': 'settings-panel'},
})
export class LocalizationSettingsComponent extends SettingsPanelComponent implements OnInit {
    public localizations: LocalizationWithLines[] = [];

    ngOnInit() {
        this.route.data.subscribe(data => {
            this.localizations = data.localizations;
        });
    }

    public getCurrentDate() {
        return new Date();
    }
}
