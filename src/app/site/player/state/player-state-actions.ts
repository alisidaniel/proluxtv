import {Video} from '../../../models/video';
import {Title} from '../../../models/title';
import {Episode} from '../../../models/episode';

export class PlayVideo {
    static readonly type = '[Player] Play Video';
    constructor(public video: Video, public mediaItem?: Title|Episode) {}
}

export class LoadRelatedVideos {
    static readonly type = '[Player] Load Related Videos';
}

export class PlayerOverlayOpened {
    static readonly type = '[Player] Overlay Opened';
}

export class PlayerOverlayClosed {
    static readonly type = '[Player] Overlay Closed';
}

export class ToggleSidebar {
    static readonly type = '[Player] Toggle Sidebar';
    constructor(public open: boolean = null) {}
}
