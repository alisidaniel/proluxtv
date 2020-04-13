import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {CurrentUser} from '@common/auth/current-user';
import {AuthService} from '@common/auth/auth.service';
import {Settings} from '@common/core/config/settings.service';
import {BreakpointsService} from '@common/core/ui/breakpoints.service';
import {NavbarDropdownItem} from '@common/core/config/app-config';
import {ThemeService} from '@common/core/theme.service';

@Component({
    selector: 'logged-in-user-widget',
    templateUrl: './logged-in-user-widget.component.html',
    styleUrls: ['./logged-in-user-widget.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoggedInUserWidgetComponent  {
    @Input() hideRegisterButton = false;

    constructor(
        public currentUser: CurrentUser,
        public auth: AuthService,
        public config: Settings,
        public breakpoints: BreakpointsService,
        public theme: ThemeService,
    ) {}

    public shouldShowMenuItem(item: NavbarDropdownItem): boolean {
        const hasPermission = !item.permission || this.currentUser.hasPermission(item.permission),
            hasRole = !item.role || this.currentUser.hasRole(item.role);
        return hasPermission && hasRole;
    }
}
