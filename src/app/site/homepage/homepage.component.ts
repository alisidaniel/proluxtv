import {ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core';
import {Select} from '@ngxs/store';
import {HomepageState} from './state/homepage-state';
import {Observable} from 'rxjs';
import {List} from '../../models/list';
import {Settings} from '@common/core/config/settings.service';

@Component({
    selector: 'homepage',
    templateUrl: './homepage.component.html',
    styleUrls: ['./homepage.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class HomepageComponent {
    @Select(HomepageState.content) content$: Observable<List[]>;

    constructor(public settings: Settings) {}
}
