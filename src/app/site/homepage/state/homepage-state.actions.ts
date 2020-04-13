export class LoadLists {
    static readonly type = '[Homepage] Load Lists';
}

export class ChangeSlide {
    static readonly type = '[Homepage] Change Slide';
    constructor(public index: number) {}
}

export class ChangeSliderFocusState {
    static readonly type = '[Homepage] Change Slider Focus State';
    constructor(public state: boolean) {}
}
