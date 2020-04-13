import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomepageListsResolverService} from './site/homepage/homepage-lists-resolver.service';
import {ContactComponent} from '@common/contact/contact.component';
import {AuthGuard} from '@common/guards/auth-guard.service';
import {HomepageHostComponent} from './site/homepage/homepage-host/homepage-host.component';
import {HomepageHostGuard} from './site/homepage/homepage-host-guard';

const routes: Routes = [
    {path: '', component: HomepageHostComponent, canActivate: [HomepageHostGuard], resolve: {api: HomepageListsResolverService}, data: {name: 'homepage'}},
    {path: 'admin', loadChildren: () => import('app/admin/app-admin.module').then(m => m.AppAdminModule), canLoad: [AuthGuard]},
    {path: 'billing', loadChildren: () => import('common/billing/billing.module').then(m => m.BillingModule)},
    {path: 'contact', component: ContactComponent},
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
