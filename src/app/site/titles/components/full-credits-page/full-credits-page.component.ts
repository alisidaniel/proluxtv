import {Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {ToggleGlobalLoader} from '../../../../state/app-state-actions';
import {TitleState} from '../../state/title-state';
import {Observable} from 'rxjs';
import {GroupedCredits, Title, TitleCredit} from '../../../../models/title';
import {TitleUrlsService} from '../../title-urls.service';
import {map} from 'rxjs/operators';

@Component({
    selector: 'full-credits-page',
    templateUrl: './full-credits-page.component.html',
    styleUrls: ['./full-credits-page.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FullCreditsPageComponent implements OnInit {
    @Select(TitleState.title) title$: Observable<Title>;
    @Select(TitleState.backdrop) backdropImage$: Observable<string>;
    public groupedCredits$: Observable<GroupedCredits>;

    constructor(
        private store: Store,
        public urls: TitleUrlsService,
    ) {
        this.groupedCredits$ = this.store.select(TitleState.titleOrEpisodeCredits)
            .pipe(map(this.groupCredits));
    }

    ngOnInit() {
        setTimeout(() => this.store.dispatch(new ToggleGlobalLoader(false)));
    }

    public trackByFn(title: Title) {
        return title.id;
    }

    private groupCredits(credits: TitleCredit[]) {
        return credits.reduce((h, a) => {
            return Object.assign(h, {[a.pivot.department]: (h[a.pivot.department] || []).concat(a)});
        }, {});
    }
}
