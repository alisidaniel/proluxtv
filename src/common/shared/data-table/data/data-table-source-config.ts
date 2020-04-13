import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {Paginator} from '@common/shared/paginator.service';
import {PaginationResponse} from '@common/core/types/pagination/pagination-response';
import {DataTableFilter} from '@common/shared/data-table/filter-panel/data-table-filters';

export interface DataTableSourceConfig<T> {
    uri?: string;
    dataPaginator?: Paginator<T>;
    matPaginator?: MatPaginator;
    matSort?: MatSort;
    filters?: DataTableFilter[];
    staticParams?: object;
    initialData?: PaginationResponse<T>;
    delayInit?: boolean;
}
