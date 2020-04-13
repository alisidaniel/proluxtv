import {ChangeDetectionStrategy, Component} from '@angular/core';
import {SettingsPanelComponent} from '../settings-panel.component';

@Component({
    selector: 'recaptcha-settings',
    templateUrl: './recaptcha-settings.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {'class': 'settings-panel'},
})
export class RecaptchaSettingsComponent extends SettingsPanelComponent {
}
