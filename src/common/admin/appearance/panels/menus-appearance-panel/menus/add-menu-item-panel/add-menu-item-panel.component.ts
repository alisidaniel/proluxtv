import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {CustomPage} from '@common/core/types/models/CustomPage';
import {Pages} from '@common/core/pages/shared/pages.service';
import {OverlayPanelRef} from '@common/core/ui/overlay-panel/overlay-panel-ref';
import {MenuEditor} from '@common/admin/appearance/panels/menus-appearance-panel/menus/menu-editor.service';
import {AppearanceEditor} from '@common/admin/appearance/appearance-editor/appearance-editor.service';
import {MenuItem} from '@common/core/ui/custom-menu/menu-item';
import {FormBuilder} from '@angular/forms';

@Component({
    selector: 'add-menu-item-panel',
    templateUrl: './add-menu-item-panel.component.html',
    styleUrls: ['./add-menu-item-panel.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddMenuItemPanelComponent implements OnInit {
    public linkForm = this.fb.group({
        action: [''],
        label: [''],
    });
    public allPages: CustomPage[];

    constructor(
        public editor: MenuEditor,
        public appearance: AppearanceEditor,
        private pages: Pages,
        private overlayPanelRef: OverlayPanelRef,
        private fb: FormBuilder,
    ) {}

    ngOnInit() {
        this.pages.getAll().subscribe(response => this.allPages = response.pagination.data);
    }

    public addLinkMenuItem() {
        this.editor.addItem(new MenuItem({
            type: 'link',
            label: this.linkForm.value.label,
            action: this.linkForm.value.action,
        }));

        this.linkForm.reset();
        this.close();
    }

    public addRouteMenuItem(route: string) {
        this.editor.addItem(new MenuItem({
            type: 'route',
            label: route,
            action: route,
        }));
        this.close();
    }

    public addPageMenuItem(page: CustomPage) {
        this.editor.addItem(new MenuItem({
            type: 'page',
            label: page.slug,
            action: page.id + '/' + page.slug,
        }));
        this.close();
    }

    public close() {
        this.overlayPanelRef.close();
    }
}
