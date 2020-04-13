import {Component, ViewEncapsulation, ChangeDetectionStrategy, Input} from '@angular/core';
import {ListItem} from '../../../lists/types/list-item';
import {Select, Store} from '@ngxs/store';
import {AddToWatchlist, RemoveFromWatchlist} from '../../../lists/user-lists/state/user-lists-state-actions';
import {UserListsState} from '../../../lists/user-lists/state/user-lists-state';
import {Observable} from 'rxjs';

@Component({
    selector: 'title-action-buttons',
    templateUrl: './title-action-buttons.component.html',
    styleUrls: ['./title-action-buttons.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TitleActionButtonsComponent {
    @Select(UserListsState.loading) loading$: Observable<boolean>;
    @Input() item: ListItem;

    constructor(private store: Store) {}

    public isInWatchlist() {
        const watchlist = this.store.selectSnapshot(UserListsState.watchlist);
        if ( ! watchlist) return false;
        return watchlist.items.findIndex(i => i.id === this.item.id && i.type === this.item.type) > -1;
    }

    public addToWatchlist() {
        this.store.dispatch(new AddToWatchlist(this.item));
    }

    public removeFromWatchlist() {
        this.store.dispatch(new RemoveFromWatchlist(this.item));
    }
}
