import {environment} from '../../../environments/environment';
import {InjectionToken} from '@angular/core';
import {ComponentType} from '@angular/cdk/portal';

export const APP_CONFIG = new InjectionToken<AppConfig[]>('APP_CONFIG');

export const DEFAULT_APP_CONFIG: AppConfig = {
    environment: environment.production ? 'production' : 'dev',
    assetsPrefix: null,
    auth: {
        // Route users should be redirected to after successful login.
        redirectUri: '/',
        // route to redirect user if homepage is set to
        // login/register but user is already logged in.
        fallbackRedirectUri: null,
        // Route admins should be redirected to after successful login.
        adminRedirectUri: '/',
    },
    accountSettings: {
        hideNavbar: false,
    },
    demo: {
        email: 'admin@admin.com',
        password: 'admin',
    },
    customPages: {
        hideNavbar: false,
    }
};

export interface AdSlotConfig {
    name?: string;
    slot: string;
    description: string;
}

export interface AppConfig {
    [key: string]: any;

    // scrollbar
    forceCustomScrollbar?: boolean;

    // backend stuff
    base_url?: string;
    version?: string;
    'homepage.type'?: string;
    'homepage.value'?: string;
    'logging.sentry_public'?: string;
    'dates.format'?: string;
    'ads.disable'?: boolean;
    menus?: string;
    'i18n.enable'?: boolean;
    'branding.site_name'?: string;
    'toast.default_timeout'?: number;

    // common config
    environment?: 'production'|'dev';
    assetsPrefix?: string|null;
    auth?: {
        redirectUri?: string,
        fallbackRedirectUri?: string,
        adminRedirectUri?: string,
        color?: 'accent'|'primary',
    };
    accountSettings?: {
        hideNavbar?: boolean,
    };
    navbar?: {
        defaultPosition: string,
        dropdownItems: NavbarDropdownItem[],
    };
    demo?: {
        email?: string,
        password?: string,
    };
    admin?: {
        appearance: AppearanceEditorConfig,
        analytics?: {
            channels?: {name: string, route: string}[],
        },
        ads?: AdSlotConfig[],
        pages: {name: string, icon: string, route: string, permission: string}[],
        settingsPages?: {name: string, route: string}[],
    };
}

export interface AppearanceEditorConfig {
    navigationRoutes: string[];
    defaultRoute?: string;
    sections?: AppearanceEditorField[];
    menus: {
        availableRoutes: string[],
        positions?: string[],
    };
}

export interface AppearanceEditorField {
    name: string;
    component?: ComponentType<any>;
    position?: number;
    route?: string;
}

export interface NavbarDropdownItem {route: string;
    name: string;
    icon: string;
    permission?: string;
    role?: string;
}
