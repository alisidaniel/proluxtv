import {Title} from '../../../models/title';
import {Person} from '../../../models/person';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {Reset, SearchEverything, SetQuery} from './search-state-actions';
import {SearchService} from '../search.service';
import {of} from 'rxjs';
import {tap} from 'rxjs/operators';
import {MEDIA_TYPE} from '../../media-type';

interface SearchStateModel {
    results: (Title|Person)[];
    query: string;
}

@State<SearchStateModel>({
    name: 'search',
    defaults: {
        results: [],
        query: '',
    }
})
export class SearchState {
    constructor(private search: SearchService) {}

    @Selector()
    static results(state: SearchStateModel) {
        return state.results;
    }

    @Selector()
    static movies(state: SearchStateModel) {
        return state.results.filter(result => result.type === MEDIA_TYPE.TITLE && !result.is_series);
    }

    @Selector()
    static series(state: SearchStateModel) {
        return state.results.filter(result => result.type === MEDIA_TYPE.TITLE && result.is_series);
    }

    @Selector()
    static people(state: SearchStateModel) {
        return state.results.filter(result => result.type === MEDIA_TYPE.PERSON);
    }

    @Selector()
    static query(state: SearchStateModel) {
        return state.query;
    }

    @Action(SearchEverything)
    searchEverything(ctx: StateContext<SearchStateModel>, {query, type, limit}: SearchEverything) {
        ctx.patchState({query: query});
        if ( ! query || query.length < 3) {
            ctx.patchState({results: []});
            return of({results: []});
        }
        return this.search.everything(query, {type, limit}).pipe(tap(response => {
            ctx.patchState({results: response.results});
        }));
    }

    @Action(SetQuery)
    setQuery(ctx: StateContext<SearchStateModel>, action: SetQuery) {
        ctx.patchState({query: action.query});
    }

    @Action(Reset)
    reset(ctx: StateContext<SearchStateModel>) {
       ctx.patchState({results: [], query: ''});
    }
}
