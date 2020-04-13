import {Injectable} from '@angular/core';
import {GestureConfig} from '@angular/material';

@Injectable()
export class AppHammerGestureConfig extends GestureConfig {
    buildHammer(element: HTMLElement) {
        return new GestureConfig({touchAction: 'pan-y'}).buildHammer(element);
    }
}
