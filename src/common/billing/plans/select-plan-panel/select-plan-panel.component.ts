import {ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output} from '@angular/core';
import {SubscriptionStepperState} from '../../subscriptions/subscription-stepper-state.service';
import {Plan} from '@common/core/types/models/Plan';

@Component({
    selector: 'select-plan-panel',
    templateUrl: './select-plan-panel.component.html',
    styleUrls: ['./select-plan-panel.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectPlanPanelComponent implements OnInit {
    public hasRecommendedPlan = false;
    @Output() selected = new EventEmitter();

    constructor(public state: SubscriptionStepperState) {}

    ngOnInit() {
        this.hasRecommendedPlan = this.state.plans.filter(plan => plan.recommended).length > 0;
    }

    public selectPlan(plan: Plan) {
        this.state.selectInitialPlan(plan);
        // fire event on next render to avoid race conditions
        setTimeout(() => this.selected.emit(plan));
    }

    public getAllPlans() {
        return this.state.plans.filter(plan => !plan.parent_id);
    }
}
