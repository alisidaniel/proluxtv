import {NgModule} from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CommonModule} from '@angular/common';
import {CustomPageComponent} from './custom-page/custom-page.component';
import {NotFoundPageComponent} from './not-found-page/not-found-page.component';
import {CustomHomepage} from './custom-homepage.service';
import {Pages} from './pages.service';
import {UiModule} from '../../ui/ui.module';

const routes: Routes = [
    {
        path: 'pages/:id/:slug',
        component: CustomPageComponent,
        data: {permissions: ['pages.view'], willSetSeo: true}
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class PagesRoutingModule {
}

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        UiModule,
        PagesRoutingModule,
    ],
    declarations: [
        CustomPageComponent,
        NotFoundPageComponent,
    ],
    providers: [
        CustomHomepage,
        Pages,
    ],
    exports: [
        CustomPageComponent,
        NotFoundPageComponent,
    ],
    entryComponents: [
        CustomPageComponent,
    ]
})
export class PagesModule {
}

