import {Component, ViewEncapsulation, ChangeDetectionStrategy, Input} from '@angular/core';
import {Genre} from '../../../../models/genre';

@Component({
    selector: 'genre-widget',
    templateUrl: './genre-widget.component.html',
    styleUrls: ['./genre-widget.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GenreWidgetComponent {
    @Input() genres: Genre[];
    @Input() limit = 4;
}
