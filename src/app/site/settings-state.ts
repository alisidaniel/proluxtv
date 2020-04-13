import {Action, createSelector, NgxsOnInit, Selector, State, StateContext, Store} from '@ngxs/store';
import {AppConfig} from '@common/core/config/app-config';
import * as Dot from 'dot-object';
import {Settings} from '@common/core/config/settings.service';

export class SetSettings {
    static readonly type = '[Settings] Set';
    constructor(public settings: AppConfig) {}
}

@State<AppConfig>({
    name: 'settings',
    defaults: {},
})
export class SettingsState implements NgxsOnInit {
    constructor(private settings: Settings, private store: Store) {}

    static setting(name: string) {
        return createSelector([SettingsState], (state: AppConfig) => {
            return Dot.pick(name, state);
        });
    }

    ngxsOnInit(ctx?: StateContext<AppConfig>) {
        this.settings.all$().subscribe(settings => {
            this.store.dispatch(new SetSettings(settings));
        });
    }

    @Action(SetSettings)
    setSettings(ctx: StateContext<AppConfig>, action: SetSettings) {
        ctx.patchState(action.settings);
    }
}
