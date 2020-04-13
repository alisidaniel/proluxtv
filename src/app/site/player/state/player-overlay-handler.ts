import {PlayerComponent} from '../player/player.component';
import {PlayVideo} from './player-state-actions';
import {OverlayPanel} from '../../../../common/core/ui/overlay-panel/overlay-panel.service';
import {Actions, ofActionSuccessful, Store} from '@ngxs/store';
import {Injectable} from '@angular/core';
import {PlayerState} from './player-state';

@Injectable({
    providedIn: 'root'
})
export class PlayerOverlayHandler {
    constructor(
        private store: Store,
        private actions$: Actions,
        private overlay: OverlayPanel
    ) {
        this.actions$.pipe(ofActionSuccessful(PlayVideo))
            .subscribe(() => {
                if ( ! this.store.selectSnapshot(PlayerState.isOpen)) {
                    this.openOverlay();
                }
            });
    }

    private openOverlay() {
        this.overlay.open(PlayerComponent, {
            origin: 'global',
            position: 'center',
            panelClass: 'player-overlay-container',
            hasBackdrop: false,
            fullScreen: true,
        });
    }
}
