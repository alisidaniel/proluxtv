import {AfterViewInit, Directive, ElementRef, OnDestroy} from '@angular/core';
import {Store} from '@ngxs/store';
import {HomepageState} from '../state/homepage-state';
import {interval, Subscription} from 'rxjs';
import {ChangeSlide, ChangeSliderFocusState} from '../state/homepage-state.actions';

const SLIDE_CLASS = '.slide';
const AUTO_SLIDE_INTERVAL_MS = 5000;

@Directive({
    selector: '[slider]'
})
export class SliderDirective implements AfterViewInit, OnDestroy {
    private slideWidth: number;
    private autoSlideSub: Subscription;

    constructor(private el: ElementRef, private store: Store) {}

    ngAfterViewInit() {
        this.setupInitialCss();
        this.listenForActiveSlideChange();
        this.listenForHoverAndFocus();

        if (this.store.selectSnapshot(HomepageState.autoSlide)) {
            this.initAutoSlide();
        }
    }

    ngOnDestroy() {
        if (this.autoSlideSub) {
            this.autoSlideSub.unsubscribe();
        }
    }

    private setupInitialCss() {
        const el = this.el.nativeElement as HTMLDivElement,
            rect = el.getBoundingClientRect(),
            slideCount = this.store.selectSnapshot(HomepageState.slideCount);

        this.slideWidth = rect.width;
        el.style.width = (this.slideWidth * slideCount) + 'px';

        Array.from(el.querySelectorAll(SLIDE_CLASS)).forEach(slideEl => {
            (slideEl as HTMLElement).style.width = this.slideWidth + 'px';
        });
    }

    private listenForActiveSlideChange() {
        this.store.select(HomepageState.activeSlide).subscribe(index => {
            this.changeSlide(index);
        });
    }

    private changeSlide(index: number) {
        this.setTransformStyle(this.slideWidth * index);
    }

    private setTransformStyle(value: number) {
        const style = 'translate3d(' + (-value) + 'px, 0px, 0px)';
        this.el.nativeElement.style.transform = style;
    }

    private initAutoSlide() {
        this.autoSlideSub = interval(AUTO_SLIDE_INTERVAL_MS).subscribe(() => {
            if (this.store.selectSnapshot(HomepageState.focused)) return;
            let index = this.store.selectSnapshot(HomepageState.activeSlide);
            this.store.dispatch(new ChangeSlide(index + 1));
        });
    }

    private listenForHoverAndFocus() {
        this.el.nativeElement.addEventListener('mouseenter', () => {
            this.store.dispatch(new ChangeSliderFocusState(true));
        });

        this.el.nativeElement.addEventListener('mouseleave', () => {
            this.store.dispatch(new ChangeSliderFocusState(false));
        });
    }
}
