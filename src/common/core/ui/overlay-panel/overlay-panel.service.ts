import {ElementRef, Injectable, Injector, TemplateRef} from '@angular/core';
import {ConnectedPosition, Overlay, OverlayConfig, PositionStrategy} from '@angular/cdk/overlay';
import {ComponentPortal, ComponentType, PortalInjector, TemplatePortal} from '@angular/cdk/portal';
import {BreakpointsService} from '../breakpoints.service';
import {OverlayPanelRef} from './overlay-panel-ref';
import {OVERLAY_PANEL_DATA} from './overlay-panel-data';
import {OverlayPanelConfig, OverlayPanelPosition} from './overlay-panel-config';
import {FullscreenOverlayScrollStrategy} from './fullscreen-overlay-scroll-strategy';
import {filter} from 'rxjs/operators';
import {ESCAPE} from '@angular/cdk/keycodes';

const DEFAULT_CONFIG = {
    hasBackdrop: true,
    closeOnBackdropClick: true,
    panelClass: 'overlay-panel',
};

@Injectable({
    providedIn: 'root'
})
export class OverlayPanel {
    constructor(
        public overlay: Overlay,
        private breakpoints: BreakpointsService,
        private injector: Injector,
    ) {}

    public open(cmp: ComponentType<any> | TemplateRef<any>, userConfig: OverlayPanelConfig): OverlayPanelRef {
        const config = Object.assign({}, DEFAULT_CONFIG, userConfig);
        const cdkConfig = {
            positionStrategy: this.getPositionStrategy(config),
            hasBackdrop: config.hasBackdrop,
            panelClass: config.panelClass,
            backdropClass: config.backdropClass,
            scrollStrategy: config.fullScreen ? new FullscreenOverlayScrollStrategy() : null,
            disposeOnNavigation: true,
        } as OverlayConfig;

        if (config.width) cdkConfig.width = config.width;
        if (config.height) cdkConfig.height = config.height;

        const overlayRef = this.overlay.create(cdkConfig);
        const overlayPanelRef = new OverlayPanelRef(overlayRef);
        const portal = cmp instanceof TemplateRef ?
            new TemplatePortal(cmp, config.viewContainerRef, config.data) :
            new ComponentPortal(cmp, null, this.createInjector(config, overlayPanelRef));
        overlayRef.attach(portal);

        if (config.closeOnBackdropClick) {
            overlayRef.backdropClick().subscribe(() => overlayPanelRef.close());
            overlayRef.keydownEvents()
                .pipe(filter(e => e.keyCode === ESCAPE))
                .subscribe(() => overlayPanelRef.close());
        }

        return overlayPanelRef;
    }

    private createInjector(config: OverlayPanelConfig, dialogRef: OverlayPanelRef): PortalInjector {
        const injectionTokens = new WeakMap();
        injectionTokens.set(OverlayPanelRef, dialogRef);
        injectionTokens.set(OVERLAY_PANEL_DATA, config.data || null);
        return new PortalInjector(this.injector, injectionTokens);
    }

    private getPositionStrategy(config: OverlayPanelConfig) {
        if (config.positionStrategy) {
            return config.positionStrategy;
        }

        const position = this.breakpoints.isMobile$.value ?
            (config.mobilePosition || config.position) :
            config.position;

        if (config.origin === 'global' || this.positionIsGlobal(position)) {
            return this.getGlobalPositionStrategy(position);
        } else {
            return this.getConnectedPositionStrategy(position, config.origin);
        }
    }

    private positionIsGlobal(position: OverlayPanelPosition) {
        return position === 'center' || !Array.isArray(position);
    }

    private getGlobalPositionStrategy(position: OverlayPanelPosition): PositionStrategy {
        if (position === 'center') {
            return this.overlay.position().global().centerHorizontally().centerVertically();
        } else {
            const global = this.overlay.position().global();
            Object.keys(position).forEach(key => {
                global[key](position[key]);
            });
            return global;
        }
    }

    private getConnectedPositionStrategy(position: OverlayPanelPosition, origin: ElementRef) {
        return this.overlay.position()
            .flexibleConnectedTo(origin)
            .withPositions(position as ConnectedPosition[]);
    }
}
