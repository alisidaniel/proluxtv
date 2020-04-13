import {Action, Selector, State, StateContext, Store} from '@ngxs/store';
import {finalize, tap} from 'rxjs/operators';
import {LoadFilterOptions, LoadMoreTitles, ReloadTitles, UpdateFilters} from './browse-title-actions';
import {Title} from '../../../../models/title';
import {BrowseTitlesQueryParams, TitlesService} from '../../titles.service';
import {Navigate} from '@ngxs/router-plugin';
import {PaginationResponse} from '@common/core/types/pagination/pagination-response';
import {CountryListItem, LanguageListItem, ValueLists} from '@common/core/services/value-lists.service';
import {Settings} from '@common/core/config/settings.service';
import {Router} from '@angular/router';

interface BrowseTitleStateModel {
    loading: boolean;
    titles?: PaginationResponse<Title>;
    filters: object;
    filterOptions: {
        countries: CountryListItem[],
        languages: LanguageListItem[],
        genres: string[],
        certifications: string[]
    };
}

@State<BrowseTitleStateModel>({
    name: 'browseTitles',
    defaults: {
        loading: false,
        filters: {},
        filterOptions: {
            genres: [],
            certifications: [],
            countries: [],
            languages: [],
        }
    }
})
export class BrowseTitleState {
    @Selector()
    static titles(state: BrowseTitleStateModel) {
        return state.titles.data;
    }

    @Selector()
    static loading(state: BrowseTitleStateModel) {
        return state.loading;
    }

    @Selector()
    static canLoadMore(state: BrowseTitleStateModel) {
        return state.titles.current_page < state.titles.last_page;
    }

    @Selector()
    static doesNotHaveResults(state: BrowseTitleStateModel) {
        // loaded titles from backend at least once
        return state.titles.data && !state.titles.data.length;
    }

    @Selector()
    static anyFilterActive(state: BrowseTitleStateModel) {
        return Object.keys(state.filters).length > 0;
    }

    @Selector()
    static countries(state: BrowseTitleStateModel) {
        return state.filterOptions.countries;
    }

    @Selector()
    static languages(state: BrowseTitleStateModel) {
        return state.filterOptions.languages;
    }

    @Selector()
    static genres(state: BrowseTitleStateModel) {
        return state.filterOptions.genres;
    }

    @Selector()
    static certifications(state: BrowseTitleStateModel) {
        return state.filterOptions.certifications;
    }

    @Selector()
    static filters(state: BrowseTitleStateModel) {
        return state.filters;
    }

    constructor(
        private store: Store,
        private titles: TitlesService,
        private valueLists: ValueLists,
        private settings: Settings,
        private router: Router,
    ) {}

    static queryParamsToFilters(params: object): BrowseTitlesQueryParams {
        const formValues = {};
        const keys = ['genre', 'released', 'score', 'runtime'];
        Object.keys(params).forEach(key => {
            if ( ! params[key]) return;

            if (keys.indexOf(key) > -1 && !Array.isArray(params[key])) {
                formValues[key] = params[key].split(',');
            } else if (params[key] === 'true') {
                formValues[key] = true;
            } else if (params[key] === 'false') {
                formValues[key] = false;
            } else {
                formValues[key] = params[key];
            }
        });
        return formValues;
    }

    static filtersToQueryParams(values: object) {
        const queryParams = {};
        Object.keys(values).forEach(key => {
            if (!values[key]) return;
            queryParams[key] = Array.isArray(values[key]) ?
                values[key].join(',') :
                values[key];
        });
        return queryParams;
    }

    @Action(ReloadTitles)
    reloadTitles(ctx: StateContext<BrowseTitleStateModel>, action: ReloadTitles) {
        const newFilters = BrowseTitleState.queryParamsToFilters(action.params);
        ctx.patchState({
            loading: true,
            filters: newFilters,
        });

        // apply specified filters as query params to current url
        this.router.navigate([], {queryParams: BrowseTitleState.filtersToQueryParams(newFilters), replaceUrl: true});

        return this.titles.getAll({...action.params, perPage: 16}).pipe(
            tap(response => {
                ctx.patchState({
                    titles: response.pagination,
                });
            }),
            finalize(() => ctx.patchState({loading: false}))
        );
    }

    @Action(LoadMoreTitles)
    loadMoreTitles(ctx: StateContext<BrowseTitleStateModel>) {
        ctx.patchState({loading: true});
        const filters = {
            ...ctx.getState().filters,
            page: ctx.getState().titles.current_page + 1,
        };
        return this.titles.getAll({...filters, perPage: 16}).pipe(
            tap(response => {
                const oldData = ctx.getState().titles.data.slice();
                response.pagination.data = [...oldData, ...response.pagination.data];
                ctx.patchState({titles: response.pagination});
            }),
            finalize(() => ctx.patchState({loading: false}))
        );
    }

    @Action(UpdateFilters)
    updateFilters(ctx: StateContext<BrowseTitleStateModel>, action: UpdateFilters) {
        ctx.patchState({
            filters: BrowseTitleState.queryParamsToFilters(action.filters),
        });
    }

    @Action(LoadFilterOptions)
    loadFilterOptions(ctx: StateContext<BrowseTitleStateModel>) {
        ctx.patchState({
            filterOptions: {
                ...ctx.getState().filterOptions,
                genres: this.settings.getJson('browse.genres'),
                certifications: this.settings.getJson('browse.ageRatings'),
            }
        });
        this.valueLists.get(['countries', 'languages']).subscribe(response => {
            ctx.patchState({
                filterOptions: {
                    ...ctx.getState().filterOptions,
                    languages: response.languages,
                    countries: response.countries,
                }
            });
        });
    }
}
