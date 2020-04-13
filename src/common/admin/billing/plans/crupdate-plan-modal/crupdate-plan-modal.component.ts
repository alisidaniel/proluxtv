import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {Plan} from '@common/core/types/models/Plan';
import {Plans} from '@common/shared/billing/plans.service';
import {Currency, ValueLists} from '@common/core/services/value-lists.service';
import {Toast} from '@common/core/ui/toast.service';
import {randomString} from '@common/core/utils/random-string';
import {finalize} from 'rxjs/operators';
import {BehaviorSubject} from 'rxjs';
import {FormBuilder} from '@angular/forms';

export interface CrupdatePlanModalData {
    plan?: Plan;
    plans: Plan[];
}

interface Errors extends Partial<Plan> {
    general?: string;
}

@Component({
    selector: 'crupdate-plan-modal',
    templateUrl: './crupdate-plan-modal.component.html',
    styleUrls: ['./crupdate-plan-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CrupdatePlanModalComponent implements OnInit {
    public loading$ = new BehaviorSubject(false);
    public newFeature: string;
    public features$ = new BehaviorSubject<{content: string, id: string}[]>([]);
    public errors$ = new BehaviorSubject<Errors>({});
    public currencies$ = new BehaviorSubject<Currency[]>([]);
    public intervals = ['day', 'week', 'month', 'year'];
    private allPlans$ = new BehaviorSubject<Plan[]>([]);
    public form = this.fb.group({
        name: [''],
        parent_id: [],
        free: [false],
        recommended: [false],
        show_permissions: [false],
        amount: [],
        currency: [],
        interval: [],
        interval_count: [],
        position: [],
        available_space: [],
        permissions: [[]],
    });

    constructor(
        private dialogRef: MatDialogRef<CrupdatePlanModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: CrupdatePlanModalData,
        public plans: Plans,
        private toast: Toast,
        private valueLists: ValueLists,
        private fb: FormBuilder,
    ) {}

    ngOnInit() {
        this.resetState();
        this.allPlans$.next(this.data.plans || []);

        this.valueLists.get(['currencies']).subscribe(response => {
            this.currencies$.next(Object.values(response.currencies));
        });

        if (this.data.plan) {
            this.hydrateModel(this.data.plan);
        }
    }

    public confirm() {
        this.loading$.next(true);
        let request;

        if (this.data.plan) {
            request = this.plans.update(this.data.plan.id, this.getPayload());
        } else {
            request = this.plans.create(this.getPayload());
        }

        request
            .pipe(finalize(() => this.loading$.next(false)))
            .subscribe(response => {
                this.close(response.plan);
                const action = this.data.plan ? 'updated' : 'created';
                this.toast.open('Plan has been ' + action);
            }, err => {
                this.errors$.next(err.messages);
            });
    }

    public getPayload() {
        const payload = {...this.form.value};
        payload.features = this.features$.value.map(feature => feature.content);

        const currency = this.currencies$.value.find(curr => curr.code === payload.currency);
        payload.currency_symbol = currency.symbol;

        return payload;
    }

    public close(data?: Plan) {
        this.resetState();
        this.dialogRef.close(data);
    }

    public addFeature() {
        const exists = this.features$.value.findIndex(curr => curr.content === this.newFeature) > -1;
        if (exists || ! this.newFeature) return;
        this.features$.next([...this.features$.value, {content: this.newFeature, id: randomString(5)}]);
        this.newFeature = null;
    }

    public removeFeature(feature: {content: string, id: string}) {
        const newFeatures = this.features$.value.filter(f => f.id !== feature.id);
        this.features$.next(newFeatures);
    }

    public getBasePlans(): Plan[] {
        return this.allPlans$.value.filter(plan => !plan.parent_id && !plan.free);
    }

    private hydrateModel(plan: Plan) {
        this.form.patchValue(plan);
        const newFeatures = plan.features.map(feature => {
            return {content: feature, id: randomString(5)};
        });
        this.features$.next(newFeatures);
    }

    private resetState() {
        this.form.reset({
            currency: 'USD',
            interval: 'month',
            interval_count: 1,
            position: 1,
            permissions: [],
            free: false,
            recommended: false,
            show_permissions: false,
        });
        this.features$.next([]);
        this.errors$.next({});
    }

    public reorderPlanFeatures(e: CdkDragDrop<void>) {
        const newFeatures = [...this.features$.value];
        moveItemInArray(newFeatures, e.previousIndex, e.currentIndex);
        this.features$.next(newFeatures);
    }

    public formValue() {
        return this.form.value as Partial<Plan>;
    }
}
