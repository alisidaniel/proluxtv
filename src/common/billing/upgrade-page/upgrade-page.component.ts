import {ChangeDetectionStrategy, Component, Input, OnInit, ViewChild} from '@angular/core';
import {MatStepper} from '@angular/material/stepper';
import {ActivatedRoute, Router} from '@angular/router';
import {SubscriptionStepperState} from '../subscriptions/subscription-stepper-state.service';
import {Settings} from '../../core/config/settings.service';
import {Toast} from '../../core/ui/toast.service';
import {Subscriptions} from '../../shared/billing/subscriptions.service';
import {BehaviorSubject} from 'rxjs';
import {LocalStorage} from '@common/core/services/local-storage.service';
import {Plan} from '@common/core/types/models/Plan';

export interface CreditCard {
    number?: number|string;
    expiration_month?: number|string;
    expiration_year?: number|string;
    security_code?: number|string;
}

enum Steps {
    Plans = 0,
    Period = 1,
    Payment = 2
}

interface LocalStorageState {
    initial?: number;
    final?: number;
}

const LOCAL_STORAGE_KEY = 'be.onboarding.selected';

@Component({
    selector: 'upgrade-page',
    templateUrl: './upgrade-page.component.html',
    styleUrls: ['./upgrade-page.component.scss'],
    providers: [SubscriptionStepperState],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpgradePageComponent implements OnInit {
    @ViewChild(MatStepper, { static: true }) stepper: MatStepper;
    @Input() mode: 'pricing'|'upgrade' = 'upgrade';
    public loading$ = new BehaviorSubject<boolean>(false);

    constructor(
        private subscriptions: Subscriptions,
        private route: ActivatedRoute,
        public settings: Settings,
        private router: Router,
        private toast: Toast,
        public state: SubscriptionStepperState,
        private localStorage: LocalStorage,
    ) {}

    ngOnInit() {
        this.route.data.subscribe((data: {plans: Plan[]}) => {
            this.state.setPlans(data.plans);
            if (this.mode === 'upgrade') {
               this.hydrateStateFromLocalStorage();
            }
        });
    }

    private hydrateStateFromLocalStorage() {
        const storedState = this.localStorage.get(LOCAL_STORAGE_KEY) as LocalStorageState;
        if (storedState && storedState.initial && storedState.final) {
            const initialPlan = this.state.plans.find(p => p.id === storedState.initial),
                finalPlan = this.state.plans.find(p => p.id === storedState.final);
            if (initialPlan && finalPlan) {
                this.state.selectInitialPlan(initialPlan);
                this.state.selectPlanById(finalPlan.id);
                this.stepper.selectedIndex = Steps.Payment;
            }
        }
    }

    public nextStep() {
        if (this.mode === 'pricing' && this.stepper.selectedIndex === Steps.Period) {
            this.localStorage.set(LOCAL_STORAGE_KEY, {
                initial: this.state.initialPlan$.value.id,
                final: this.state.selectedPlan$.value.id
            });
            this.router.navigate(['register']);
        } else {
            this.stepper.next();
        }
    }

    public onCompleted() {
        this.loading$.next(false);
        this.router.navigate(['/']);
        this.localStorage.remove(LOCAL_STORAGE_KEY);
        this.toast.open({
            message: 'Subscribed to ":planName" plan successfully.',
            replacements: {planName: this.getSelectedOrParentPlanName()},
        });
    }

    private getSelectedOrParentPlanName(): string {
        const selectedPlan = this.state.selectedPlan$.value;
        const plan = selectedPlan.parent ? selectedPlan.parent : selectedPlan;
        return plan.name;
    }
}
