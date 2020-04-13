import {ChangeDetectionStrategy, Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatHorizontalStepper, MatStepper} from '@angular/material/stepper';
import {Plan} from '@common/core/types/models/Plan';
import {SubscriptionStepperState} from '@common/billing/subscriptions/subscription-stepper-state.service';
import {ConfirmModalComponent} from '@common/core/ui/confirm-modal/confirm-modal.component';

export interface SelectPlanModalData {
    plans: Plan[];
}

@Component({
    selector: 'select-plan-modal',
    templateUrl: './select-plan-modal.component.html',
    styleUrls: ['./select-plan-modal.component.scss'],
    providers: [SubscriptionStepperState],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectPlanModalComponent implements OnInit {
    @ViewChild(MatHorizontalStepper, { static: true }) stepper: MatStepper;

    constructor(
        private dialogRef: MatDialogRef<ConfirmModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: SelectPlanModalData,
        public state: SubscriptionStepperState,
    ) {}

    ngOnInit() {
        this.state.setPlans(this.data.plans);
    }

    public close() {
        this.dialogRef.close(this.state.selectedPlan$.value);
    }

    public nextStep() {
        this.stepper.next();
    }
}
