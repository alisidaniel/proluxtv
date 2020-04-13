import {Component, ViewEncapsulation, ChangeDetectionStrategy, OnInit} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {TitleState} from '../../state/title-state';
import {Observable} from 'rxjs';
import {Episode} from '../../../../models/episode';
import {Title} from '../../../../models/title';
import {FormControl} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {TitleUrlsService} from '../../title-urls.service';
import {ToggleGlobalLoader} from '../../../../state/app-state-actions';
import {filter} from 'rxjs/operators';
import {Season} from '../../../../models/season';

@Component({
    selector: 'season-page',
    templateUrl: './season-page.component.html',
    styleUrls: ['./season-page.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SeasonPageComponent implements OnInit {
    @Select(TitleState.episodes) episodes$: Observable<Episode[]>;
    @Select(TitleState.title) title$: Observable<Title>;
    @Select(TitleState.seasons) seasons$: Observable<Season[]>;
    @Select(TitleState.backdrop) backdropImage$: Observable<string>;

    public seasonModel = new FormControl();

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private store: Store,
        public urls: TitleUrlsService,
    ) {}

    ngOnInit() {
        this.route.params.subscribe(() => {
            // TODO: remove settimout
            setTimeout(() => this.store.dispatch(new ToggleGlobalLoader(false)));
        });

        this.store.select(TitleState.season)
            .pipe(filter(season => !!season))
            .subscribe(season => {
                this.seasonModel.setValue(season.number, {
                    emitEvent: false
                });
            });

        this.seasonModel.valueChanges.subscribe(seasonNumber => {
            const title = this.store.selectSnapshot(TitleState.title);
            this.router.navigate(this.urls.season(title, seasonNumber));
        });
    }
}
