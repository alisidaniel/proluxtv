import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild, Router, CanActivate} from '@angular/router';
import { CurrentUser } from '../auth/current-user';
import { AuthService } from '../auth/auth.service';
import {Settings} from '@common/core/config/settings.service';

@Injectable({
    providedIn: 'root',
})
export class CheckPermissionsGuard implements CanActivate, CanActivateChild {

    constructor(
        private currentUser: CurrentUser,
        private router: Router,
        private auth: AuthService,
        private settings: Settings,
    ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.runAuthCheck(route, state);
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.runAuthCheck(route, state);
    }

    private runAuthCheck(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this.settings.get('billing.force_subscription') && !this.currentUser.isAdmin() && !this.currentUser.isSubscribed() && !route.data.allowIfSubscriptionForced) {
            this.router.navigate(['/billing/upgrade']);
        } else {
            return this.checkPermissions(route, state);
        }
    }

    private getActiveRoute(route: ActivatedRouteSnapshot): ActivatedRouteSnapshot {
        while (route.firstChild) route = route.firstChild;
        return route;
    }

    private checkPermissions(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        let hasPermission = true;

        if (route.data.permissions) {
            hasPermission = this.currentUser.hasPermissions(route.data.permissions);
        }

        // user can access this route, bail
        if (hasPermission) return true;

        // redirect to login page, if user is not logged in
        if ( ! this.currentUser.isLoggedIn()) {
            this.currentUser.redirectUri = state.url;
            this.router.navigate(['login']);
        } else {
            this.router.navigate([this.auth.getRedirectUri()]);
        }

        return hasPermission;
    }
}
