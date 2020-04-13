import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {CurrentUser} from '@common/auth/current-user';
import {Settings} from '@common/core/config/settings.service';

@Injectable({
    providedIn: 'root',
})
export class HomepageHostGuard implements CanActivate {
    constructor(
        private currentUser: CurrentUser,
        private router: Router,
        private settings: Settings,
    ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this.settings.get('billing.force_subscription') && this.currentUser.isLoggedIn() && !this.currentUser.isSubscribed() && !this.currentUser.isAdmin()) {
            this.router.navigate(['/billing/upgrade']);
            return false;
        }
        return true;
    }
}
