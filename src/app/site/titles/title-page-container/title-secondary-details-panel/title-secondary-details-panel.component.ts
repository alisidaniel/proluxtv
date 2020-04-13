import {ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChange, ViewEncapsulation} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {TitleState} from '../../state/title-state';
import {Observable} from 'rxjs';
import {Title, TitleCredit} from '../../../../models/title';
import {Video} from '../../../../models/video';
import {PlayVideo} from '../../../player/state/player-state-actions';
import {Episode} from '../../../../models/episode';
import {MEDIA_TYPE} from '../../../media-type';
import {Season} from '../../../../models/season';

@Component({
    selector: 'title-secondary-details-panel',
    templateUrl: './title-secondary-details-panel.component.html',
    styleUrls: ['./title-secondary-details-panel.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class TitleSecondaryDetailsPanelComponent implements OnChanges {
    @Select(TitleState.title) title$: Observable<Title>;
    @Select(TitleState.videoCoverImage) videoCoverImage$: Observable<string>;
    @Select(TitleState.primaryVideo) primaryVideo$: Observable<Video>;
    @Select(TitleState.seasons) seasons$: Observable<Season[]>;

    @Input() item: Title|Episode;

    public credits: {
        director?: TitleCredit,
        writers?: TitleCredit[],
        creators?: TitleCredit[],
        cast?: TitleCredit[],
    };

    constructor(private store: Store) {}

    ngOnChanges(changes: {item: SimpleChange}) {
        if (changes.item.currentValue && changes.item.currentValue.credits) {
            this.setCrew();
        }
    }

    public playVideo(video: Video) {
        const title = this.store.selectSnapshot(TitleState.title);
        this.store.dispatch(new PlayVideo(video, title));
    }

    public isSeries() {
        return this.item.type === MEDIA_TYPE.TITLE && this.item.is_series;
    }

    private setCrew() {
        const credits = this.store.selectSnapshot(TitleState.titleOrEpisodeCredits);
        this.credits = {
            director: this.getDirector(credits),
            writers: this.getWriters(credits),
            cast: this.getCast(credits),
            creators: this.getCreators(credits),
        };
    }

    public getDirector(credits: TitleCredit[]) {
        return credits.find(person => person.pivot.department === 'directing');
    }

    private getWriters(credits: TitleCredit[]) {
        return credits.filter(person => person.pivot.department === 'writing');
    }

    private getCast(credits: TitleCredit[]) {
        return credits.filter(person => person.pivot.department === 'cast').slice(0, 3);
    }

    private getCreators(credits: TitleCredit[]) {
        return credits.filter(person => person.pivot.department === 'creators');
    }
}
