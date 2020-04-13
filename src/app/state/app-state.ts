import {Action, Selector, State, StateContext} from '@ngxs/store';
import {ToggleGlobalLoader} from './app-state-actions';

interface AppStateModel {
    loading: boolean;
}

@State<AppStateModel>({
    name: 'app',
    defaults: {
        loading: false,
    }
})
export class AppState {
    @Selector()
    static loading(state: AppStateModel) {
        return state.loading;
    }

    @Action(ToggleGlobalLoader)
    toggleGlobalLoader(ctx: StateContext<AppStateModel>, action: ToggleGlobalLoader) {
        ctx.patchState({loading: action.visible});
    }
}
