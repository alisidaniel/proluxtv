import {Inject, Injectable} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {ActivatedRoute, ActivatedRouteSnapshot, Data, NavigationEnd, NavigationStart, Router} from '@angular/router';
import {filter, map, take} from 'rxjs/operators';
import {BehaviorSubject, Observable} from 'rxjs';
import {Settings} from '../config/settings.service';
import {Translations} from '../translations/translations.service';
import {ucFirst} from '../utils/uc-first';

export interface MetaTag {
    nodeName: 'meta'|'script'|'title'|'link';
    type?: string;
    content?: string;
    property?: string;
    _text?: string;
    href?: string;
    rel?: string;
}

const TAG_CLASS = 'dst';

@Injectable({
    providedIn: 'root'
})
export class MetaTagsService {
    public latestMetaTags$ = new BehaviorSubject<MetaTag[]>(null);

    constructor(
        @Inject(DOCUMENT) private document: Document,
        private router: Router,
        private settings: Settings,
        private i18n: Translations,
        private route: ActivatedRoute,
    ) {}

    public init() {
        // clear previous route meta tags
        this.router.events
            .pipe(filter(e => e instanceof NavigationStart))
            .subscribe(() => {
                this.latestMetaTags$.next(null);
            });

        this.activeRoute$()
            .subscribe(route => {
                // meta tags were fetched with route resolver
                if (this.latestMetaTags$.value) {
                    this.addTags(this.latestMetaTags$.value);

                // route will fetch meta tags via ajax, wait for it
                } else if (route.data.willSetSeo) {
                    this.latestMetaTags$.pipe(filter(tags => !!tags), take(1)).subscribe(tags => {
                        this.addTags(tags);
                    });

                // route does not have specific meta tags, set default ones
                } else {
                    this.addTags(this.getDefaultTags(route.data));
                }
            });
    }

    public addTags(tags: MetaTag[]) {
        this.removeOldTags();
        const firstChild = this.document.head.firstChild;
        tags.forEach(tag => {
            const node = document.createElement(tag.nodeName);
            node.classList.add(TAG_CLASS);
            Object.keys(tag).forEach(key => {
                if (key === 'nodeName') return;

                if (key === '_text') {
                    node.textContent = typeof tag[key] === 'string' ? tag[key] : JSON.stringify(tag[key]);
                } else {
                    node.setAttribute(key, tag[key]);
                }
            });

            this.document.head.insertBefore(node, firstChild);
        });
    }

    private removeOldTags() {
        const tags = this.document.head.getElementsByClassName(TAG_CLASS);
        for (let i = 0; i < tags.length; i++) {
            this.document.head.removeChild(tags[i]);
        }
    }

    private activeRoute$(): Observable<ActivatedRouteSnapshot> {
        return this.router.events
            .pipe(
                filter(e => e instanceof NavigationEnd),
                map(() => this.route),
                map((route: ActivatedRoute) => {
                    while (route.firstChild) route = route.firstChild;
                    return route;
                }),
                filter((route: ActivatedRoute) => route.outlet === 'primary'),
                map(route => route.snapshot)
            );
    }

    public getDefaultTags(routeData: Data): MetaTag[] {
        const title = {
            nodeName: 'title',
            _text: this.settings.get('branding.site_name'),
        } as MetaTag;

        const defaultTitle = routeData.title || routeData.name;

        // prepend route name to site name, if available
        if (defaultTitle) {
            const name = this.i18n.t(defaultTitle.replace(/-/g, ' '));
            title._text = name + ' - ' + title._text;
        }

        title._text = ucFirst(title._text);

        return [title];
    }
}
