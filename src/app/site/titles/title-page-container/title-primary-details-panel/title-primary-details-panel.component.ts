import {ChangeDetectionStrategy, Component, Input, ViewEncapsulation} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {TitleState} from '../../state/title-state';
import {Observable} from 'rxjs';
import {Title} from '../../../../models/title';
import {Episode} from '../../../../models/episode';
import {MEDIA_TYPE} from '../../../media-type';
import {TitleUrlsService} from '../../title-urls.service';
import {ShareableNetworks, shareLinkSocially} from '../../../../../common/core/utils/share-link-socially';
import {Settings} from '../../../../../common/core/config/settings.service';
import {shareViaEmail} from '../../../../../common/core/utils/share-via-email';
import {copyToClipboard} from '../../../../../common/core/utils/copy-link-to-clipboard';
import {MESSAGES} from '../../../../toast-messages';
import {Translations} from '../../../../../common/core/translations/translations.service';
import {Toast} from '../../../../../common/core/ui/toast.service';

@Component({
    selector: 'title-primary-details-panel',
    templateUrl: './title-primary-details-panel.component.html',
    styleUrls: ['./title-primary-details-panel.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class TitlePrimaryDetailsPanelComponent {
    @Select(TitleState.title) title$: Observable<Title>;
    @Input() item: Title|Episode;

    constructor(
        public urls: TitleUrlsService,
        private settings: Settings,
        private store: Store,
        private i18n: Translations,
        private toast: Toast,
    ) {}

    public isEpisode() {
        return this.item.type === MEDIA_TYPE.EPISODE;
    }

    public isSeries(): boolean {
        return this.item.type === MEDIA_TYPE.TITLE && this.item.is_series;
    }

    public isMovie(): boolean {
        return this.item.type === MEDIA_TYPE.TITLE && !this.item.is_series;
    }

    public shareUsing(type: ShareableNetworks | 'mail' | 'copy') {
        const title = this.store.selectSnapshot(TitleState.title);
        const link = this.settings.getBaseUrl(true) + 'titles/' + title.id;

        if (type === 'mail') {
            const siteName = this.settings.get('branding.site_name');
            const subject = this.i18n.t('Check out this link on ') + siteName;
            const body = `${title.name} - ${siteName} - ${link}`;
            shareViaEmail(subject, body);
        } else if (type === 'copy') {
            if (copyToClipboard(link)) {
                this.toast.open(MESSAGES.COPY_TO_CLIPBOARD_SUCCESS);
            }
        } else {
            shareLinkSocially(type, link, title.name);
        }
    }

    public isReleased() {
        return new Date(this.item.release_date) < new Date();
    }
}
