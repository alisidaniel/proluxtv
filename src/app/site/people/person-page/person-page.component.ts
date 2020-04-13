import {Component, ViewEncapsulation, ChangeDetectionStrategy, OnInit} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {PersonState} from '../state/person-state';
import {Observable} from 'rxjs';
import {Person} from '../../../models/person';
import {TitleUrlsService} from '../../titles/title-urls.service';
import {Title} from '../../../models/title';
import {ToggleGlobalLoader} from '../../../state/app-state-actions';
import {ActivatedRoute} from '@angular/router';
import {ViewportScroller} from '@angular/common';

@Component({
    selector: 'person-page',
    templateUrl: './person-page.component.html',
    styleUrls: ['./person-page.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PersonPageComponent implements OnInit {
    @Select(PersonState.person) person$: Observable<Person>;
    @Select(PersonState.credits) credits$: Observable<{[key: string]: Title[]}>;
    @Select(PersonState.knownFor) knownFor$: Observable<Title[]>;
    @Select(PersonState.backdrop) backdrop$: Observable<string>;
    @Select(PersonState.creditsCount) creditsCount$: Observable<number>;

    constructor(
        public urls: TitleUrlsService,
        private store: Store,
        private route: ActivatedRoute,
        private viewportScroller: ViewportScroller,
    ) {}

    ngOnInit() {
        this.route.params.subscribe(() => {
            this.viewportScroller.scrollToPosition([0, 0]);
            this.store.dispatch(new ToggleGlobalLoader(false));
        });
    }

    public trackByFn(title: Title) {
        return title.id;
    }
}
