import {Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy} from '@angular/core';
import {CurrentUser} from '../../../../common/auth/current-user';
import {Select, Store} from '@ngxs/store';
import {LoadUserLists} from './state/user-lists-state-actions';
import {UserListsState} from './state/user-lists-state';
import {Observable} from 'rxjs';
import {List} from '../../../models/list';

@Component({
    selector: 'user-lists',
    templateUrl: './user-lists.component.html',
    styleUrls: ['./user-lists.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserListsComponent implements OnInit {
    @Select(UserListsState.lists) lists$: Observable<List[]>;
    @Select(UserListsState.loading) loading$: Observable<boolean>;

    constructor(
        private store: Store,
        private currentUser: CurrentUser
    ) {}

    ngOnInit() {
        this.store.dispatch(new LoadUserLists());
    }
}
