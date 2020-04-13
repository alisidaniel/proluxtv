import {ChangeDetectionStrategy, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {catchError, debounceTime, distinctUntilChanged, finalize, map, switchMap} from 'rxjs/operators';
import {ControlValueAccessor, FormControl, FormGroup, FormGroupDirective, NG_VALUE_ACCESSOR} from '@angular/forms';
import {BehaviorSubject, Observable, of, Subscription} from 'rxjs';
import {TitlesService} from '../../../site/titles/titles.service';
import {Title} from '../../../models/title';

@Component({
    selector: 'select-title-input',
    templateUrl: './select-title-input.component.html',
    styleUrls: ['./select-title-input.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: SelectTitleInputComponent,
        multi: true,
    }]
})
export class SelectTitleInputComponent implements ControlValueAccessor, OnInit, OnDestroy {
    @ViewChild('searchInput', {static: true}) searchInput: ElementRef<HTMLInputElement>;
    @Input() hideTitleSelect: boolean;
    @Input() hideEpisodeSelect: boolean;
    public formGroup: FormGroup;
    public searchFormControl = new FormControl();
    public loading$ = new BehaviorSubject(false);
    public titles$ = new BehaviorSubject<Title[]>([]);
    public disabled$ = new BehaviorSubject<boolean>(false);
    public selectedTitle$ = new BehaviorSubject<Title>(null);
    private propagateChange: Function;
    public searchedOnce = false;
    private subscriptions: Subscription[] = [];

    constructor(
        private titles: TitlesService,
        private container: FormGroupDirective,
    ) {}

    ngOnInit() {
        this.bindToSearchControl();
        this.formGroup = this.container.form;

        // clear selected episode on season change
        const sub = this.formGroup.get('season').valueChanges.subscribe(() => {
            this.formGroup.patchValue({episode: null});
        });
        this.subscriptions.push(sub);
    }

    ngOnDestroy()  {
        this.subscriptions.forEach(s => s && s.unsubscribe());
    }

    public writeValue(value: Title) {
        this.selectedTitle$.next(value);
    }

    public registerOnChange(fn: Function) {
        this.propagateChange = fn;
    }

    public registerOnTouched() {}

    public setDisabledState(isDisabled: boolean) {
        this.disabled$.next(isDisabled);
    }

    private bindToSearchControl() {
        this.searchFormControl.valueChanges.pipe(
            debounceTime(150),
            distinctUntilChanged(),
            switchMap(query => this.searchTitles(query)),
            catchError(() => of([])),
        ).subscribe(titles => {
            this.searchedOnce = true;
            this.titles$.next(titles);
        });
    }

    private searchTitles(query: string): Observable<Title[]> {
        this.loading$.next(true);
        return this.titles.getAll({query, perPage: 7, with: ['seasons']})
            .pipe(
                finalize(() =>  this.loading$.next(false)),
                map(response => response.pagination.data),
            );
    }

    public onMenuOpened() {
        if (!this.searchedOnce) {
            this.clearSearchInput();
        }
        setTimeout(() => {
            this.searchInput.nativeElement.focus();
        });
    }

    public selectTitle(title: Title) {
        this.selectedTitle$.next(title);
        this.formGroup.patchValue({
            season: null,
            episode: null,
        });
        this.propagateChange(title);
    }

    public clearSearchInput() {
        this.searchFormControl.setValue('');
    }

    public onMenuClosed() {
        this.loading$.next(false);
        this.clearSearchInput();
    }

    public getEpisodeIterable(): undefined[] {
        const seasonNum = this.formGroup.get('season').value || 1;
        const season = this.selectedTitle$.value.seasons[seasonNum];
        const count = season && season.episode_count ? season.episode_count : 24;
        return new Array(count);
    }

    public prefixWithZero(number: number|string) {
        if (number < 10) {
            number = '0' + number;
        }
        return number;
    }
}
