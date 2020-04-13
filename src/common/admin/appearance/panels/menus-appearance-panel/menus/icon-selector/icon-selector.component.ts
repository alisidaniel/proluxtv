import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {finalize} from 'rxjs/operators';
import {AppHttpClient} from '@common/core/http/app-http-client.service';
import {OverlayPanelRef} from '@common/core/ui/overlay-panel/overlay-panel-ref';

@Component({
    selector: 'icon-selector',
    templateUrl: './icon-selector.component.html',
    styleUrls: ['./icon-selector.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconSelectorComponent implements OnInit {
    public icons$: BehaviorSubject<string[]> = new BehaviorSubject([]);
    public loading$: BehaviorSubject<boolean> = new BehaviorSubject(false);

    constructor(
        private http: AppHttpClient,
        private overlayPanelRef: OverlayPanelRef,
    ) {}

    ngOnInit() {
        this.loading$.next(true);
        this.http.get('admin/icons')
            .pipe(finalize(() => this.loading$.next(false)))
            .subscribe(response => {
                this.icons$.next(response.icons);
            });
    }

    public selectIcon(icon: string) {
        this.overlayPanelRef.emitValue(icon);
        this.overlayPanelRef.close();
    }
}
