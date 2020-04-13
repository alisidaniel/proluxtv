import {Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, OnDestroy} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {ActivatedRoute, Router} from '@angular/router';
import {CreatePerson, DetachCredit, LoadPerson, ResetState, UpdatePerson} from './state/crupdate-person-state-actions';
import {CrupdatePersonState} from './state/crupdate-person-state';
import {FormBuilder} from '@angular/forms';
import {BehaviorSubject, Observable} from 'rxjs';
import {Title, TitleCredit} from '../../../models/title';
import {MatTableDataSource} from '@angular/material';
import {MESSAGES} from '../../../toast-messages';
import {UploadQueueService} from '@common/uploads/upload-queue/upload-queue.service';
import {Toast} from '@common/core/ui/toast.service';
import {openUploadWindow} from '@common/uploads/utils/open-upload-window';
import {UploadInputTypes} from '@common/uploads/upload-input-config';

@Component({
    selector: 'crupdate-person-page',
    templateUrl: './crupdate-person-page.component.html',
    styleUrls: ['./crupdate-person-page.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [UploadQueueService],
})
export class CrupdatePersonPageComponent implements OnInit, OnDestroy {
    @Select(CrupdatePersonState.loading) loading$: Observable<boolean>;
    @Select(CrupdatePersonState.credits) credits$: Observable<Title[]>;
    public poster$ = new BehaviorSubject<string>(null);
    public dataSource = new MatTableDataSource();

    public personForm = this.fb.group({
        name: [''],
        poster: [''],
        popularity: [''],
        description: [''],
        known_for: [''],
        birth_place: [''],
        birth_date: [''],
        death_date: [''],
        gender: [null],
        allow_update: [true],
    });

    constructor(
        private store: Store,
        private toast: Toast,
        private router: Router,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private uploadQueue: UploadQueueService,
    ) {}

    ngOnInit() {
        // TODO: sorting accessor not working for some reason
        this.dataSource.sortingDataAccessor = (item: TitleCredit, property) => {
            switch (property) {
                case 'credit':
                    return item.name;
                default:
                    return item.pivot[property];
            }
        };

        this.route.params.subscribe(params => {
            this.loadPerson(params);
        });

        this.store.select(CrupdatePersonState.credits).subscribe(credits => {
            this.dataSource.data = credits;
        });

        this.personForm.get('poster').valueChanges.subscribe(value => {
            this.poster$.next(value);
        });
    }

    ngOnDestroy() {
        this.store.dispatch(new ResetState());
    }

    public uploadPoster() {
        openUploadWindow({types: [UploadInputTypes.image]}).then(upload => {
            const params = {
                uri: 'uploads/images',
                httpParams: {
                    path: 'media-images/posters'
                },
            };
            this.uploadQueue.start(upload, params).subscribe(fileEntry => {
                this.personForm.patchValue({
                    poster: fileEntry.url
                });
            });
        });
    }

    private loadPerson(params: {id?: string}) {
        if ( ! params.id) return;
        this.store.dispatch(new LoadPerson(+params.id)).subscribe(() => {
            const person = this.store.selectSnapshot(CrupdatePersonState.person);
            this.personForm.patchValue(person);
            this.poster$.next(person.poster);
        });
    }

    public submit() {
        const person = this.store.selectSnapshot(CrupdatePersonState.person);
        const response = person.id ?
            this.store.dispatch(new UpdatePerson(this.personForm.value)) :
            this.store.dispatch(new CreatePerson(this.personForm.value));

        response.subscribe(() => {
            this.router.navigate(['/admin/people']);
            this.toast.open(person.id ? MESSAGES.PERSON_UPDATE_SUCCESS : MESSAGES.PERSON_CREATE_SUCCESS);
        });
    }

    public detachCredit(credit: TitleCredit) {
        if ( ! credit.pivot) return;
        this.store.dispatch(new DetachCredit(credit.pivot.id))
            .subscribe(() => {
                this.toast.open(MESSAGES.CREDIT_REMOVE_SUCCESS);
            });
    }

    public applyFilter(value: string) {
        this.dataSource.filter = value;
    }
}
