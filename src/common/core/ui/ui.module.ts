import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoResultsMessageComponent } from './no-results-message/no-results-message.component';
import { CommonModule } from '@angular/common';
import { CustomMenuComponent } from './custom-menu/custom-menu.component';
import { EmptyRouteComponent } from './empty-route/empty-route.component';
import { EnterKeybindDirective } from './enter-keybind.directive';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ConfirmModalModule } from './confirm-modal/confirm-modal.module';
import { LoggedInUserWidgetComponent } from './logged-in-user-widget/logged-in-user-widget.component';
import { MaterialNavbar } from './material-navbar/material-navbar.component';
import { AdHostComponent } from './ad-host/ad-host.component';
import { FormattedDatePipe } from './formatted-date.pipe';
import { CustomScrollbarModule } from './custom-scrollbar/custom-scrollbar.module';
import { BreakpointsService } from './breakpoints.service';
import { ContextMenuDirective } from './context-menu/context-menu.directive';
import { TranslationsModule } from '../translations/translations.module';
import { FormattedFileSizePipe } from '../../uploads/formatted-file-size.pipe';
import { DomSanitizer } from '@angular/platform-browser';
import { Settings } from '../config/settings.service';
import {ContactComponent} from '../../contact/contact.component';
import {LoadingPageComponent} from './loading-indicator/loading-page/loading-page.component';
import { AuthClickDirective } from './auth-click.directive';
import {ImageOrIconComponent} from './image-or-icon/image-or-icon.component';
import { InfoPopoverComponent } from './info-popover/info-popover.component';
import {LoadingIndicatorModule} from '@common/core/ui/loading-indicator/loading-indicator.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        HttpClientModule,
        LoadingIndicatorModule,

        // internal
        CustomScrollbarModule,
        ConfirmModalModule,
        TranslationsModule,

        // material
        MatButtonModule,
        MatSnackBarModule,
        MatMenuModule,
        MatCheckboxModule,
        MatTooltipModule,
        MatIconModule,
    ],
    declarations: [
        LoadingPageComponent,
        NoResultsMessageComponent,
        CustomMenuComponent,
        EmptyRouteComponent,
        EnterKeybindDirective,
        LoggedInUserWidgetComponent,
        MaterialNavbar,
        AdHostComponent,
        ContactComponent,
        FormattedDatePipe,
        ContextMenuDirective,
        FormattedFileSizePipe,
        AuthClickDirective,
        ImageOrIconComponent,
        InfoPopoverComponent,
    ],
    exports: [
        LoadingPageComponent,
        NoResultsMessageComponent,
        CustomMenuComponent,
        EmptyRouteComponent,
        EnterKeybindDirective,
        LoggedInUserWidgetComponent,
        MaterialNavbar,
        AdHostComponent,
        ContactComponent,
        FormattedDatePipe,
        ContextMenuDirective,
        FormattedFileSizePipe,
        AuthClickDirective,
        ImageOrIconComponent,
        InfoPopoverComponent,

        // angular
        CommonModule,
        FormsModule,
        ReactiveFormsModule,

        // internal
        ConfirmModalModule,
        CustomScrollbarModule,
        TranslationsModule,
        LoadingIndicatorModule,

        // material
        MatButtonModule,
        MatSnackBarModule,
        MatMenuModule,
        MatCheckboxModule,
        MatTooltipModule,
        MatIconModule,
    ],
    providers: [BreakpointsService]
})
export class UiModule {
    constructor(
        private icons: MatIconRegistry,
        private sanitizer: DomSanitizer,
        private config: Settings,
    ) {
        const url = this.config.getAssetUrl('icons/merged.svg?v2');
        this.icons.addSvgIconSet(
            this.sanitizer.bypassSecurityTrustResourceUrl(url)
        );
    }
}
