import {APP_INITIALIZER, ErrorHandler, ModuleWithProviders, NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {UiModule} from './ui/ui.module';
import {Settings} from './config/settings.service';
import {Bootstrapper, init_app} from './bootstrapper.service';
import {ravenErrorHandlerFactory} from './errors/raven-error-handler';
import {HttpErrorHandler} from './http/errors/http-error-handler.service';
import {BackendHttpErrorHandler} from './http/errors/backend-http-error-handler.service';
import {HttpModule} from './http/http.module';
import {TranslationsModule} from './translations/translations.module';
import {APP_CONFIG, DEFAULT_APP_CONFIG} from './config/app-config';
import { CurrentUser } from '../auth/current-user';
import {MetaTagsInterceptor} from './meta/meta-tags-interceptor';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        HttpClientModule,
        UiModule,
        HttpModule,
        TranslationsModule,
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        HttpClientModule,
        UiModule,
    ],
})
export class CoreModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: CoreModule,
            providers: [
                Bootstrapper,
                CurrentUser,
                {
                    provide: APP_CONFIG,
                    useValue: DEFAULT_APP_CONFIG,
                    multi: true,
                },
                {
                    provide: HttpErrorHandler,
                    useClass: BackendHttpErrorHandler,
                },
                {
                    provide: APP_INITIALIZER,
                    useFactory: init_app,
                    deps: [Bootstrapper],
                    multi: true,
                },
                {
                    provide: ErrorHandler,
                    useFactory: ravenErrorHandlerFactory,
                    deps: [Settings, CurrentUser],
                },
                {
                    provide: HTTP_INTERCEPTORS,
                    useClass: MetaTagsInterceptor,
                    multi: true,
                },
            ]
        };
    }
}

