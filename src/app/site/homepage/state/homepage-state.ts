import {List} from '../../../models/list';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {tap} from 'rxjs/operators';
import {HomepageService} from '../homepage.service';
import {ChangeSlide, ChangeSliderFocusState, LoadLists} from './homepage-state.actions';
import {MetaTag} from '../../../../common/core/meta/meta-tags.service';

export interface HomepageStateModel {
    lists: List[];
    slider: {
        activeSlide: number;
        autoSlide: boolean;
        slideCount: number;
        focused: boolean;
    };
    contentLoaded: boolean;
    metaTags?: MetaTag[];
}

@State<HomepageStateModel>({
    name: 'homepage',
    defaults: {
        slider: {
            activeSlide: 0,
            autoSlide: false,
            slideCount: 0,
            focused: false,
        },
        contentLoaded: false,
        lists: [],
        metaTags: [],
    }
})
export class HomepageState {
    constructor(private homepage: HomepageService) {}

    @Selector()
    static sliderList(state: HomepageStateModel) {
        return state.lists[0];
    }

    @Selector()
    static activeSlide(state: HomepageStateModel) {
        return state.slider.activeSlide;
    }

    @Selector()
    static autoSlide(state: HomepageStateModel) {
        return state.slider.autoSlide;
    }

    @Selector()
    static slideCount(state: HomepageStateModel) {
        return state.slider.slideCount;
    }

    @Selector()
    static focused(state: HomepageStateModel) {
        return state.slider.focused;
    }

    @Selector()
    static content(state: HomepageStateModel) {
        return state.lists.slice(1);
    }

    @Action(LoadLists)
    loadLists(ctx: StateContext<HomepageStateModel>) {
        if (ctx.getState().contentLoaded) return;
        return this.homepage.getLists().pipe(tap(response => {
            const sliderList = response.lists[0];
            ctx.patchState({
                lists: response.lists,
                metaTags: response.seo,
                contentLoaded: true,
                slider: {...ctx.getState().slider, slideCount: sliderList ? sliderList.items.length : 0},
            });
        }));
    }

    @Action(ChangeSlide)
    changeSlide(ctx: StateContext<HomepageStateModel>, action: ChangeSlide) {
        const lastSlide = ctx.getState().slider.slideCount - 1;
        let index = action.index;

        if (action.index > lastSlide) {
            index = 0;
        } else if (action.index < 0) {
            index = lastSlide;
        }

        return ctx.patchState({
            slider: {...ctx.getState().slider, activeSlide: index}
        });
    }

    @Action(ChangeSliderFocusState)
    changeSliderFocusState(ctx: StateContext<HomepageStateModel>, action: ChangeSliderFocusState) {
        return ctx.patchState({
            slider: {...ctx.getState().slider, focused: action.state}
        });
    }
}
