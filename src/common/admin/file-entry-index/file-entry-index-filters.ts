import {DataTableFilter} from '@common/shared/data-table/filter-panel/data-table-filters';

export const FILE_ENTRY_INDEX_FILTERS: DataTableFilter[] = [
    {
        name: 'type',
        column: 'type',
        type: 'select',
        options: [
            {name: 'any'},
            {name: 'audio', value: 'audio'},
            {name: 'video', value: 'video'},
            {name: 'image', value: 'image'},
            {name: 'folder', value: 'folder'},
            {name: 'pdf', value: 'pdf'},
            {name: 'archive', value: 'archive'},
        ]
    },
    {
        name: 'status',
        column: 'public',
        type: 'select',
        options: [
            {name: 'any'},
            {name: 'public', value: true},
            {name: 'private', value: false},
        ]
    },
    {
        name: 'Protection',
        column: 'password',
        type: 'select',
        options: [
            {name: 'any'},
            {name: 'has password', value: true},
            {name: 'does not have password', value: false},
        ]
    },
    {
        name: 'uploaded between',
        column: 'created_at',
        type: 'date',
    },
];
