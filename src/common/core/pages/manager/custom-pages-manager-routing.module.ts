import {Routes} from '@angular/router';
import {CustomPagesIndexComponent} from '@common/core/pages/manager/custom-pages-index/custom-pages-index.component';
import {CrupdatePageComponent} from '@common/core/pages/manager/crupdate-page/crupdate-page.component';

export const customPagesManagerRoutes: Routes = [
    {
        path: 'custom-pages',
        component: CustomPagesIndexComponent,
        data: {permissions: ['pages.view'], name: 'Custom Pages'}
    },
    {
        path: 'custom-pages/new',
        component: CrupdatePageComponent,
        data: {permissions: ['pages.create'], name: 'Add New Page'}
    },
    {
        path: 'custom-pages/:id/edit',
        component: CrupdatePageComponent,
        data: {permissions: ['pages.update'], name: 'Edit Page'}
    },
];

