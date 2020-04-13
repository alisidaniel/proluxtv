import {Injectable} from '@angular/core';
import {Bootstrapper} from '../common/core/bootstrapper.service';
import {Store} from '@ngxs/store';
import {SetRatings, SetWatchlist} from './site/lists/user-lists/state/user-lists-state-actions';

@Injectable()
export class AppBootstrapperService extends Bootstrapper {

    /**
     * Handle specified bootstrap data.
     */
    protected handleData(encodedData: string) {
        const data = super.handleData(encodedData);

        // set user watchlist
        this.injector.get(Store).dispatch(new SetWatchlist(data['watchlist']));

        // set user ratings
        this.injector.get(Store).dispatch(new SetRatings(data['ratings']));

        return data;
    }
}
