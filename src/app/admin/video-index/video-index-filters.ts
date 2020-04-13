import {DataTableFilter} from '@common/shared/data-table/filter-panel/data-table-filters';
import {SelectTitleInputComponent} from './select-title-input/select-title-input.component';
import {SelectUserInputComponent} from '@common/core/ui/select-user-input/select-user-input/select-user-input.component';

export const VIDEO_INDEX_FILTERS: DataTableFilter[] = [
    {
        name: 'Source',
        column: 'source',
        type: 'select',
        options: [
            {name: 'all'},
            {name: 'local'},
            {name: 'external'}
        ]
    },
    {
        name: 'Category',
        column: 'category',
        type: 'select',
        options: [
            {name: 'all'},
            {name: 'trailer'},
            {name: 'clip'},
            {name: 'featurette'},
            {name: 'teaser'},
            {name: 'full', displayName: 'Full Movie or episode'}
        ]
    },
    {
        name: 'approved',
        column: 'approved',
        type: 'select',
        options: [
            {name: 'all'},
            {name: 'approved only', value: true},
            {name: 'not approved only', value: false}
        ]
    },
    {
        name: 'quality',
        column: 'quality',
        type: 'select',
        options: [
            {name: 'all'},
            {name: 'SD', value: 'sd'},
            {name: 'HD', value: 'hd'},
            {name: '4k', value: '4k'},
            {name: 'HDR', value: 'hdr'},
        ]
    },
    {
        name: 'type',
        column: 'type',
        type: 'select',
        options: [
            {name: 'all'},
            {name: 'Embed'},
            {name: 'Direct Video', value: 'video'},
            {name: 'frame'},
            {name: 'Remote Link', value: 'external'},
        ]
    },
    {
        name: 'user',
        column: 'user_id',
        component: SelectUserInputComponent,
        type: 'custom',
    },
    {
        name: 'title',
        column: 'titleId',
        component: SelectTitleInputComponent,
        type: 'custom',
    },
    {
        name: 'season',
        column: 'season',
    },
    {
        name: 'episode',
        column: 'episode',
    },
];
