import {Action, Selector, State, StateContext} from '@ngxs/store';
import {ListsService} from '../../lists.service';
import {MESSAGES} from '../../../../toast-messages';
import {finalize, tap} from 'rxjs/operators';
import {
    AddRating,
    AddToWatchlist,
    ClearUserLists,
    LoadUserLists,
    RemoveFromWatchlist, RemoveRating, SetRatings,
    SetWatchlist
} from './user-lists-state-actions';
import {MinimalWatchlist} from '../../types/minimal-watchlist';
import {List} from '../../../../models/list';
import {Review} from '../../../../models/review';
import {CurrentUser} from '@common/auth/current-user';
import {Toast} from '@common/core/ui/toast.service';

interface WatchlistStateModel {
    loading: boolean;
    watchlist?: MinimalWatchlist;
    lists: List[];
    ratings: Review[];
}

@State<WatchlistStateModel>({
    name: 'userLists',
    defaults: {
        loading: false,
        ratings: [],
        lists: [],
    }
})
export class UserListsState {
    @Selector()
    static loading(state: WatchlistStateModel) {
        return state.loading;
    }

    @Selector()
    static watchlist(state: WatchlistStateModel) {
        return state.watchlist;
    }

    @Selector()
    static lists(state: WatchlistStateModel) {
        return state.lists;
    }

    @Selector()
    static ratings(state: WatchlistStateModel) {
        return state.ratings;
    }

    constructor(
        private lists: ListsService,
        private currentUser: CurrentUser,
        private toast: Toast,
    ) {}

    @Action(AddToWatchlist)
    addToWatchlist(ctx: StateContext<WatchlistStateModel>, action: AddToWatchlist) {
        ctx.patchState({loading: true});
        const listId = ctx.getState().watchlist.id;
        return this.lists.addItem(listId, action.item).pipe(
            tap(() => {
                this.toast.open(MESSAGES.WATCHLIST_ADD_SUCCESS);
                const watchlist = ctx.getState().watchlist;
                watchlist.items.push({id: action.item.id, type: action.item.type});
                ctx.patchState({watchlist: {...watchlist}});
            }),
            finalize(() => ctx.patchState({loading: false}))
        );
    }

    @Action(RemoveFromWatchlist)
    removeFromWatchlist(ctx: StateContext<WatchlistStateModel>, action: RemoveFromWatchlist) {
        ctx.patchState({loading: true});
        const listId = ctx.getState().watchlist.id;
        return this.lists.removeItem(listId, action.item).pipe(
            tap(() => {
                this.toast.open(MESSAGES.WATCHLIST_REMOVE_SUCCESS);
                const watchlist = ctx.getState().watchlist;
                const i = watchlist.items.findIndex(item => item.id === action.item.id && item.type === action.item.type);
                watchlist.items.splice(i, 1);
                ctx.patchState({watchlist: {...watchlist}});
            }),
            finalize(() => ctx.patchState({loading: false}))
        );
    }

    @Action(SetWatchlist)
    setWatchlist(ctx: StateContext<WatchlistStateModel>, action: SetWatchlist) {
        ctx.patchState({watchlist: action.watchlist});
    }

    @Action(SetRatings)
    setRatings(ctx: StateContext<WatchlistStateModel>, action: SetRatings) {
        ctx.patchState({ratings: action.ratings || []});
    }

    @Action(AddRating)
    addRating(ctx: StateContext<WatchlistStateModel>, action: AddRating) {
        const oldRatings = ctx.getState().ratings.slice();
        const index = oldRatings.findIndex(r => r.id === action.rating.id);

        if (index > -1) {
            oldRatings[index] = action.rating;
        } else {
            oldRatings.push(action.rating);
        }

        ctx.patchState({ratings: oldRatings});
    }

    @Action(RemoveRating)
    removeRating(ctx: StateContext<WatchlistStateModel>, action: RemoveRating) {
        const newRatings = ctx.getState().ratings.filter(rating => {
            return rating.id !== action.rating.id;
        });

        ctx.patchState({ratings: newRatings});
    }

    @Action(LoadUserLists)
    loadUserLists(ctx: StateContext<WatchlistStateModel>) {
        if (ctx.getState().lists.length) return;
        ctx.patchState({loading: true});
        const params = {userId: this.currentUser.get('id')};
        return this.lists.getAll(params).pipe(
            tap(response => {
                ctx.patchState({lists: response.pagination.data});
            }),
            finalize(() => ctx.patchState({loading: false}))
        );
    }

    @Action(ClearUserLists)
    clearUserLists(ctx: StateContext<WatchlistStateModel>) {
        ctx.patchState({lists: []});
    }
}
