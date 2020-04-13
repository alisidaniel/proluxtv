import {Injectable} from '@angular/core';
import {User} from '../core/types/models/User';
import {Role} from '../core/types/models/Role';
import {Subscription} from '../shared/billing/models/subscription';
import {BehaviorSubject} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class CurrentUser {
    private model$ = new BehaviorSubject<User>(null);
    private guestsRole: Role;
    private permissions: string[] = [];
    public isLoggedIn$ = this.model$.pipe(map(u => !!u.id));

    /**
     * Uri user was attempting to open before
     * redirect to login page, if any.
     */
    public redirectUri?: string;

    public get<K extends keyof User>(prop: K): User[K]  {
        return this.model$.value && this.model$.value[prop];
    }

    public getModel(): User {
        return {...this.model$.value};
    }

    public set(key: string, value: any): void {
        this.model$.next({...this.model$.value, [key]: value});
    }

    public assignCurrent(model?: User) {
        this.clear();
        if (model) {
            this.permissions = (model.permissions || []).map(p => p.name);
            this.model$.next(model);
        } else {
            this.clear();
        }
    }

    public hasPermissions(permissions: string[]): boolean {
        return permissions.filter(permission => {
            return !this.hasPermission(permission);
        }).length === 0;
    }

    public hasPermission(permission: string): boolean {
        return this.permissions.includes('admin') || this.permissions.includes(permission);
    }

    public hasRole(role: string): boolean {
        return this.model$.value.roles && !!this.model$.value.roles.find(r => r.name === role);
    }

    public isLoggedIn(): boolean {
        return this.get('id') > 0;
    }

    /**
     * Check if user subscription is active, on trial, or on grace period.
     */
    public isSubscribed(): boolean {
        if ( ! this.model$.value.subscriptions) return false;
        return this.model$.value.subscriptions.find(sub => sub.valid) !== undefined;
    }

    /**
     * Check if user subscription is active
     */
    public subscriptionIsActive(): boolean {
        return this.isSubscribed() && !this.onTrial();
    }

    public onTrial() {
        const sub = this.getSubscription();
        return sub && sub.on_trial;
    }

    public onGracePeriod(): boolean {
        const sub = this.getSubscription();
        return sub && sub.on_grace_period;
    }

    public getSubscription(filters: { gateway?: string, planId?: number } = {}): Subscription {
        if (!this.isSubscribed()) return null;

        let subs = this.model$.value.subscriptions.slice();

        if (filters.gateway) {
            subs = subs.filter(sub => sub.gateway === filters.gateway);
        }

        if (filters.planId) {
            subs = subs.filter(sub => sub.plan_id === filters.planId);
        }

        return subs[0];
    }

    public setSubscription(subscription: Subscription) {
        const i = this.model$.value.subscriptions.findIndex(sub => sub.id === subscription.id);

        if (i > -1) {
            this.model$.value.subscriptions[i] = subscription;
        } else {
            this.model$.value.subscriptions.push(subscription);
        }
    }

    public isAdmin(): boolean {
        return this.hasPermission('admin');
    }

    public clear() {
        this.permissions = this.guestsRole.permissions.map(p => p.name);
        this.model$.next(new User({roles: [this.guestsRole]}));
    }

    public init(params: { user?: User, guestsRole: Role }) {
        this.guestsRole = params.guestsRole;
        this.assignCurrent(params.user);
    }
}
