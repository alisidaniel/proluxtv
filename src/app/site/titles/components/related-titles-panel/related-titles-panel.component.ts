import {Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, HostBinding} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {LoadRelatedTitles} from '../../state/title-actions';
import {TitleState} from '../../state/title-state';
import {Observable} from 'rxjs';
import {Title} from '../../../../models/title';
import {ActivatedRoute} from '@angular/router';

@Component({
    selector: 'related-titles-panel',
    templateUrl: './related-titles-panel.component.html',
    styleUrls: ['./related-titles-panel.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RelatedTitlesPanelComponent implements OnInit {
    @Select(TitleState.relatedTitles) related$: Observable<Title[]>;

    // need at least 4 related titles to display properly
    @HostBinding('class.hidden') get noRelatedTitles() {
        const length = this.store.selectSnapshot(TitleState.relatedTitles).length;
        return length < 4;
    }

    constructor(
        private store: Store,
        private route: ActivatedRoute,
    ) {}

    ngOnInit() {
        this.route.params.subscribe(() => {
            this.store.dispatch(new LoadRelatedTitles());
        });
    }
}
