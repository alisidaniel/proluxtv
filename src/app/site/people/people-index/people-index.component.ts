import {ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {PeopleService} from '../people.service';
import {BehaviorSubject} from 'rxjs';
import {Person} from '../../../models/person';
import {finalize} from 'rxjs/operators';
import {TitleUrlsService} from '../../titles/title-urls.service';
import {InfiniteScroll} from '@common/core/ui/infinite-scroll/infinite.scroll';
import {PaginationResponse} from '@common/core/types/pagination/pagination-response';
import {ActivatedRoute, Router} from '@angular/router';
import {FormControl} from '@angular/forms';

@Component({
    selector: 'people-index',
    templateUrl: './people-index.component.html',
    styleUrls: ['./people-index.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PeopleIndexComponent extends InfiniteScroll implements OnInit {
    public loading$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public people$: BehaviorSubject<PaginationResponse<Person>> = new BehaviorSubject(null);
    public sortFormControl = new FormControl('');
    public sortOptions = {
        'name': 'Name',
        'birth_date': 'Birthday',
        'popularity': 'Popularity',
        'created_at': 'Date Added',
    };

    constructor(
        private people: PeopleService,
        public urls: TitleUrlsService,
        private route: ActivatedRoute,
        private router: Router,
    ) {
        super();
    }

    ngOnInit() {
        super.ngOnInit();
        this.loadPeople();

        const defaultSort = this.route.snapshot.queryParams.sort ?
            this.route.snapshot.queryParams.sort :
            'popularity:desc';
        this.sortFormControl.setValue(defaultSort);

        this.sortFormControl.valueChanges.subscribe(sort => {
            this.router.navigate([], {queryParams: {sort}});
            this.loadPeople(true);
        });
    }

    private loadPeople(reload = false) {
        this.loading$.next(true);
        const page = (this.people$.value && !reload) ? (this.people$.value.current_page + 1) : 1;
        this.people.getAll({perPage: 10, page, mostPopular: true, order: this.sortFormControl.value})
            .pipe(finalize(() => this.loading$.next(false)))
            .subscribe(response => {
                if (this.people$.value && !reload) {
                    response.pagination.data = [...this.people$.value.data, ...response.pagination.data];
                }
                this.people$.next(response.pagination);
            });
    }

    protected loadMoreItems() {
        this.loadPeople();
    }

    protected canLoadMore() {
        return !this.isLoading() && this.people$.value.current_page < this.people$.value.last_page;
    }

    protected isLoading() {
        return this.loading$.value;
    }
}
