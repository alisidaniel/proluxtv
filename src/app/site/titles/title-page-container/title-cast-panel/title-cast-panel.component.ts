import {Component, ViewEncapsulation} from '@angular/core';
import {TitleCredit} from '../../../../models/title';
import {TitleUrlsService} from '../../title-urls.service';
import {Select} from '@ngxs/store';
import {TitleState} from '../../state/title-state';
import {Observable} from 'rxjs';

@Component({
    selector: 'title-cast-panel',
    templateUrl: './title-cast-panel.component.html',
    styleUrls: ['./title-cast-panel.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class TitleCastPanelComponent {
    @Select(TitleState.titleOrEpisodeCast) cast$: Observable<TitleCredit[]>;

    constructor(public urls: TitleUrlsService) {}
}
