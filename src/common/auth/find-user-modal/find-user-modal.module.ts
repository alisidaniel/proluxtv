import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FindUserModalComponent} from './find-user-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import {UiModule} from '../../core/ui/ui.module';

@NgModule({
    declarations: [
        FindUserModalComponent,
    ],
    imports: [
        CommonModule,
        MatDialogModule,
        UiModule,
    ],
    entryComponents: [
        FindUserModalComponent,
    ]
})
export class FindUserModalModule {
}
