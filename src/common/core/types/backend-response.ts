import {Observable} from 'rxjs';
import { MetaTag } from '../meta/meta-tags.service';

type Generic<T extends {}> = T & {
    status: string,
    seo?: MetaTag[]
};

export interface BackendResponse<T> extends Observable<Generic<T>> {}
