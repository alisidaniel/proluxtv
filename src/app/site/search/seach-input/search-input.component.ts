import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnInit,
    Output,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import {FormControl} from '@angular/forms';
import {catchError, debounceTime, distinctUntilChanged, filter, map, switchMap} from 'rxjs/operators';
import {Observable, of} from 'rxjs';
import {SearchService} from '../search.service';
import {Title} from '../../../models/title';
import {Router} from '@angular/router';
import {Person} from '../../../models/person';
import {GetTitleResponse, TitlesService} from '../../titles/titles.service';
import {Select, Store} from '@ngxs/store';
import {Reset, SearchEverything} from '../state/search-state-actions';
import {SearchState} from '../state/search-state';
import {ToggleGlobalLoader} from '../../../state/app-state-actions';
import {MatAutocompleteSelectedEvent} from '@angular/material';
import {TitleUrlsService} from '../../titles/title-urls.service';
import {MEDIA_TYPE} from '../../media-type';
import {GetPersonResponse, PeopleService} from '../../people/people.service';
import {SetPerson} from '../../people/state/person-state-actions';
import {SetTitle} from '../../titles/state/title-actions';
import {SearchResult} from '../search-result';

@Component({
    selector: 'search-input',
    templateUrl: './search-input.component.html',
    styleUrls: ['./search-input.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class SearchInputComponent implements OnInit {
    @ViewChild('inputEl', {static: true}) inputEl: ElementRef<HTMLInputElement>;
    @Output() resultSelected: EventEmitter<Title|Person> = new EventEmitter();
    @Input() placeholder = 'Search for movies, tv shows and people...';
    @Input() label: string;
    @Input() type: MEDIA_TYPE;
    @Input() resetInputOnSelect = true;

    public searchControl = new FormControl();
    public results$: Observable<(Title|Person)[]>;

    constructor(
        private search: SearchService,
        private router: Router,
        private titles: TitlesService,
        private people: PeopleService,
        private store: Store,
        private urls: TitleUrlsService,
    ) {}

    ngOnInit() {
        this.bindToSearchQueryControl();

        this.results$ = this.store.select(SearchState.results)
            .pipe(map(results => {
                // no need for autocomplete dropdown if user is on search page
                if (this.isSearchPage()) {
                    return [];
                } else {
                    return results;
                }
            }));
    }

    private bindToSearchQueryControl() {
        this.searchControl.valueChanges
            .pipe(
                debounceTime(200),
                distinctUntilChanged(),
                filter(query => typeof query === 'string'),
                switchMap(query => {
                    const limit = this.isSearchPage() ? 20 : 8;
                    return this.store.dispatch(new SearchEverything(query, this.type, limit));
                }),
                catchError(() => of({results: []})),
            ).subscribe();
    }

    public selectResult(e: MatAutocompleteSelectedEvent) {
        this.reset();
        const shouldNavigate = !this.resultSelected.observers.length,
            result = e.option.value as SearchResult;

        if (shouldNavigate) {
            this.store.dispatch(new ToggleGlobalLoader(true));
        }

        this.loadResult(result).subscribe(response => {
            const mediaItem = response['title'] || response['person'];
            if (shouldNavigate) {
                this.openMediaItemPage(response, mediaItem);
            } else {
                this.resultSelected.emit(mediaItem);
            }
        }, () => {
            this.store.dispatch(new ToggleGlobalLoader(false));
        });
    }

    private openMediaItemPage(response: GetPersonResponse|GetTitleResponse, mediaItem: Title|Person) {
        if (mediaItem.type === MEDIA_TYPE.PERSON) {
            this.store.dispatch(new SetPerson(response as GetPersonResponse));
        } else {
            const titleResponse = response as GetTitleResponse;
            this.store.dispatch(new SetTitle(titleResponse, {titleId: titleResponse.title.id}));
        }

        this.router.navigate(this.urls.mediaItem(mediaItem));
    }

    private loadResult(result: SearchResult): Observable<GetPersonResponse|GetTitleResponse> {
        if (result.type === MEDIA_TYPE.PERSON) {
            return this.people.get(result.id)
                .pipe(map(response => response));
        } else {
            return this.titles.get(result.id)
                .pipe(map(response => response));
        }
    }

    private reset() {
        this.inputEl.nativeElement.blur();
        this.store.dispatch(new Reset());
        if (this.resetInputOnSelect) {
            this.searchControl.reset();
        }
    }

    public openSearchPage() {
        this.router.navigate(
            ['search'],
            {queryParams: {query: this.searchControl.value}}
        );
    }

    public isPerson(result: SearchResult): boolean {
        return result.type === MEDIA_TYPE.PERSON;
    }

    public displayFn(result: Person|Title): string {
        return result ? result.name : null;
    }

    public isSearchPage(): boolean {
        return this.router.url.includes('/search?query');
    }
}
