import {ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {FormBuilder} from '@angular/forms';
import {LoadFilterOptions, LoadMoreTitles, ReloadTitles} from '../../state/browse/browse-title-actions';
import {BrowseTitleState} from '../../state/browse/browse-title.state';
import {Observable, Subscription} from 'rxjs';
import {Title} from '../../../../models/title';
import {ActivatedRoute} from '@angular/router';
import {MatSelectionList} from '@angular/material';
import {debounceTime, skip} from 'rxjs/operators';
import {InfiniteScroll} from '@common/core/ui/infinite-scroll/infinite.scroll';
import {CountryListItem, LanguageListItem} from '@common/core/services/value-lists.service';
import {BreakpointsService} from '@common/core/ui/breakpoints.service';
import {Settings} from '@common/core/config/settings.service';
import {TITLE_SORT_OPTIONS} from './select-options/title-sort-options';

@Component({
    selector: 'browse-titles',
    templateUrl: './browse-titles.component.html',
    styleUrls: ['./browse-titles.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BrowseTitlesComponent extends InfiniteScroll implements OnInit, OnDestroy {
    @ViewChild('genreList', {static: true}) genreList: MatSelectionList;
    @Select(BrowseTitleState.titles) titles$: Observable<Title[]>;
    @Select(BrowseTitleState.doesNotHaveResults) doesNotHaveResults$: Observable<boolean>;
    @Select(BrowseTitleState.loading) loading$: Observable<boolean>;
    @Select(BrowseTitleState.anyFilterActive) anyFilterActive$: Observable<boolean>;
    @Select(BrowseTitleState.countries) countries$: Observable<CountryListItem[]>;
    @Select(BrowseTitleState.languages) languages$: Observable<LanguageListItem[]>;
    @Select(BrowseTitleState.genres) genres$: Observable<string[]>;
    @Select(BrowseTitleState.certifications) certifications$: Observable<string[]>;
    private formSub: Subscription;
    public sortOptions = TITLE_SORT_OPTIONS;

    public form = this.fb.group({
        type: [],
        genre: [],
        released: [],
        score: [],
        country: [],
        language: [],
        runtime: [],
        certification: [],
        order: [],
        onlyStreamable: [],
    });

    constructor(
        private store: Store,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        public breakpoints: BreakpointsService,
        public settings: Settings,
    ) {
        super();
        this.store.dispatch(new LoadFilterOptions());
    }

    ngOnInit() {
        super.ngOnInit();

        this.route.queryParams.pipe(skip(1)).subscribe(params => {
            if (params.type && params.type !== this.form.value.type) {
                this.form.reset({type: params.type});
            }
        });

        // reload titles when form is updated
        this.formSub = this.form.valueChanges
            .pipe(debounceTime(50))
            .subscribe(value => {
                this.store.dispatch(new ReloadTitles(
                    this.filterOutNullAndMaxValues(value)
                ));
            });

        const params = BrowseTitleState.queryParamsToFilters(
            this.route.snapshot.queryParams
        );
        if ( ! params.onlyStreamable) {
            params.onlyStreamable = !!this.settings.get('browse.streamable_filter_state', false);
        }
        this.form.patchValue(params);
    }

    private filterOutNullAndMaxValues(params: object) {
        const filtered = {};
        // filters with these values are at maximum range. Rating at
        // (1 to 10) for example so we can remove this filter completely
        const maxValues = ['1,255', '1.0,10.0', '1880,' + this.currentYear()];
        Object.keys(params).forEach(key => {
            const value = params[key],
                isEmpty = Array.isArray(value) && !value.length;
            if (value && !isEmpty && maxValues.indexOf(value) === -1) {
                filtered[key] = value;
            }
        });

        return filtered;
    }

    ngOnDestroy() {
        this.formSub.unsubscribe();
    }

    public clearAllFilters() {
        this.form.reset();
    }

    public currentYear(): number {
        return (new Date()).getFullYear();
    }

    protected loadMoreItems() {
        this.store.dispatch(new LoadMoreTitles());
    }

    protected canLoadMore() {
        return this.store.selectSnapshot(BrowseTitleState.canLoadMore);
    }

    protected isLoading() {
        return this.store.selectSnapshot(BrowseTitleState.loading);
    }
}
