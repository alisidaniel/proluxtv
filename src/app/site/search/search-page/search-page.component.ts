import {Component, ViewEncapsulation, ChangeDetectionStrategy, OnInit, OnDestroy} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {SearchState} from '../state/search-state';
import {Observable} from 'rxjs';
import {Title} from '../../../models/title';
import {Person} from '../../../models/person';
import {ToggleGlobalLoader} from '../../../state/app-state-actions';
import {Reset} from '../state/search-state-actions';
import {ActivatedRoute} from '@angular/router';

@Component({
    selector: 'search-page',
    templateUrl: './search-page.component.html',
    styleUrls: ['./search-page.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchPageComponent implements OnInit, OnDestroy {
    @Select(SearchState.query) query$: Observable<string>;
    @Select(SearchState.movies) movies$: Observable<Title[]>;
    @Select(SearchState.series) series$: Observable<Title[]>;
    @Select(SearchState.people) people$: Observable<Person[]>;

    constructor(
        private store: Store,
        private route: ActivatedRoute,
    ) {}

    ngOnInit() {
        this.route.queryParams.subscribe(() => {
            // TODO: remove "setTimeout"
            setTimeout(() => {
                this.store.dispatch(new ToggleGlobalLoader(false));
            });
        });
    }

    ngOnDestroy() {
        this.store.dispatch(new Reset());
    }
}
