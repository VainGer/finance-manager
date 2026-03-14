import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import ApiProvider from '../../../../../services/api.service';
import AuthService from '../../../../../services/auth.service';
import ProfileDataService from '../../../../../services/profileData.service';

type Phase = 'dates' | 'categories';

interface CategoryBudgetItem {
  name: string;
  budget: string;
  include: boolean;
}

@Component({
  selector: 'app-create-budget',
  imports: [ReactiveFormsModule],
  templateUrl: './create-budget.component.html',
  styleUrl: './create-budget.component.css',
})
export class CreateBudgetComponent implements OnInit, OnDestroy {
  private api = inject(ApiProvider);
  private auth = inject(AuthService);
  private pData = inject(ProfileDataService);
  private fb = inject(FormBuilder);
  private sub: Subscription | undefined;

  phase: Phase = 'dates';
  categoryBudgets: CategoryBudgetItem[] = [];

  datesForm: FormGroup;

  constructor() {
    this.datesForm = this.fb.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit() {
    this.sub = this.pData.categoryAndBusinessNames$.subscribe((cats) => {
      this.categoryBudgets = cats.map((c) => ({
        name: c.category,
        budget: '',
        include: true,
      }));
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  get remainingAmount(): number {
    const allocated = this.categoryBudgets.reduce(
      (sum, c) => sum + (parseFloat(c.budget) || 0),
      0,
    );
    return (parseFloat(this.datesForm.value.amount) || 0) - allocated;
  }

  updateCategoryBudget(index: number, value: string) {
    const updated = [...this.categoryBudgets];
    updated[index] = { ...updated[index], budget: value };
    this.categoryBudgets = updated;
  }

  toggleCategoryInclude(index: number, include: boolean) {
    const updated = [...this.categoryBudgets];
    updated[index] = { ...updated[index], include };
    this.categoryBudgets = updated;
  }

  validateDates(event: Event) {
    event.preventDefault();
    const { startDate, endDate } = this.datesForm.value;
    const account = this.auth.getAccount();
    const profile = this.auth.getProfile();
    this.api
      .post('budgets/check-budget-dates', {
        username: account?.username,
        profileName: profile?.profileName,
        startDate,
        endDate,
      })
      .subscribe({
        next: (response: any) => {
          if (response.isValid) {
            this.phase = 'categories';
          } else {
            console.log('dates overlap');
          }
        },
        error(_err) {
          console.log('default server error');
        },
      });
  }

  submitCreate(event: Event) {
    event.preventDefault();
    const account = this.auth.getAccount();
    const profile = this.auth.getProfile();
    const { startDate, endDate, amount } = this.datesForm.value;

    const finalBudgets = this.categoryBudgets
      .filter((c) => c.include && parseFloat(c.budget) > 0)
      .map((c) => ({ categoryName: c.name, amount: parseFloat(c.budget) }));

    if (finalBudgets.length === 0) return;

    this.api
      .post('budgets/add-budget', {
        budgetData: {
          username: account?.username,
          profileName: profile?.profileName,
          refId: profile?.expenses,
          profileBudget: {
            startDate,
            endDate,
            amount: parseFloat(amount),
            spent: 0,
          },
          categoriesBudgets: finalBudgets,
        },
      })
      .subscribe({
        next: () => {
          this.pData.fetchBudgets();
        },
        error(_err) {
          console.log('default server error');
        },
      });
  }
}