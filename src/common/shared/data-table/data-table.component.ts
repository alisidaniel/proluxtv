import {
    AfterContentInit,
    ChangeDetectionStrategy,
    Component,
    ContentChildren,
    ElementRef,
    Input,
    OnInit,
    QueryList,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatColumnDef, MatTable} from '@angular/material/table';
import {PaginatedDataTableSource} from './data/paginated-data-table-source';
import {OverlayPanel} from '@common/core/ui/overlay-panel/overlay-panel.service';
import {FilterPanelComponent} from '@common/shared/data-table/filter-panel/filter-panel.component';
import {OverlayPanelRef} from '@common/core/ui/overlay-panel/overlay-panel-ref';
import {LEFT_POSITION} from '@common/core/ui/overlay-panel/positions/left-position';

@Component({
    selector: 'data-table',
    templateUrl: './data-table.component.html',
    styleUrls: ['./data-table.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,

    // can't add encapsulation as won't be able
    // to style common table columns otherwise
    encapsulation: ViewEncapsulation.None,
})
export class DataTableComponent<T> implements OnInit, AfterContentInit {
    @ViewChild(MatTable, {static: true}) table: MatTable<T>;
    @ContentChildren(MatColumnDef) columnDefs: QueryList<MatColumnDef>;
    @ViewChild(MatPaginator, {static: true}) matPaginator: MatPaginator;
    @ViewChild('filterButton', {static: false, read: ElementRef}) filterButton: ElementRef<HTMLButtonElement>;

    @Input() public dataSource: PaginatedDataTableSource<T>;
    @Input() public itemsName: string;
    @Input() public showCheckbox = true;
    public columns: string[] = ['select'];
    public filterPanelRef: OverlayPanelRef;

    constructor(private overlayPanel: OverlayPanel) {}

    ngOnInit() {
        this.dataSource.config.matPaginator = this.matPaginator;
        if (this.dataSource.config.matSort) {
            this.dataSource.config.matSort.start = 'desc';
        }
        if ( ! this.dataSource.config.delayInit) {
            this.dataSource.init();
        }
    }

    ngAfterContentInit() {
        // Register default column defs to the table
        this.columnDefs.forEach(columnDef => {
            this.columns.push(columnDef.name);
            this.table.addColumnDef(columnDef);
        });
    }

    public openFiltersPanel() {
        if (this.filterPanelRef) {
            this.filterPanelRef.close();
        } else {
            const position = LEFT_POSITION.slice();
            position[0].offsetY = 40;
            position[1].offsetY = 40;
            this.filterPanelRef = this.overlayPanel.open(FilterPanelComponent, {
                origin: this.filterButton,
                position: position,
                mobilePosition: 'center',
                data: {source: this.dataSource}
            });
            this.filterPanelRef.afterClosed().subscribe(() => {
                this.filterPanelRef = null;
            });
        }
    }
}
