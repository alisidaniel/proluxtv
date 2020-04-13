import {Injectable} from '@angular/core';
import {HttpCacheClient} from '../http/http-cache-client';
import {BackendResponse} from '../types/backend-response';
import {CustomDomain} from '@common/custom-domain/custom-domain';
import {CustomPage} from '@common/core/types/models/CustomPage';
import {Permission} from '@common/core/types/models/permission';
import {CssTheme} from '@common/core/types/models/CssTheme';

export interface Currency {
    name: string;
    decimal_digits: number;
    symbol: string;
    code: string;
}

export interface Timezone {
    abbr: string;
    isdst: boolean;
    offset: number;
    text: string;
    utc: string[];
    value: string;
}

export interface SelectOptionLists {
    countries?: CountryListItem[];
    timezones?: Timezone[];
    languages?: LanguageListItem[];
    localizations?: string[];
    currencies?: {[key: string]: Currency};
    domains?: CustomDomain[];
    pages?: CustomPage[];
    themes?: CssTheme[];
    permissions?: Permission[];
}

export interface CountryListItem {
    name: string;
    code: string;
}

export interface LanguageListItem {
    name: string;
    nativeName?: string;
    code: string;
}

@Injectable({
    providedIn: 'root',
})
export class ValueLists {
    constructor(private httpClient: HttpCacheClient) {}

    public get(names: (keyof SelectOptionLists | string)[], params: object = {}): BackendResponse<SelectOptionLists> {
        return this.httpClient.getWithCache('value-lists/' + names.join(','), params);
    }
}
