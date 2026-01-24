import { Component, Input, SimpleChanges } from '@angular/core';
import { Budget, CategoryBudget } from '../../../../types';

@Component({
  selector: 'app-budget-summary',
  imports: [],
  templateUrl: './budget-summary.component.html',
  styleUrl: './budget-summary.component.css',
})
export class BudgetSummaryComponent {
  @Input() profileBudget: Budget[] = [];
  @Input() categoryBudgets: CategoryBudget[] = [];
  currentProfileBudget: Budget | undefined;

  get currentCategoryBudgets(): CategoryBudget[] {
    if (!this.currentProfileBudget) return [];

    return this.categoryBudgets
      .map((cb) => ({
        ...cb,
        budgets: cb.budgets.filter(
          (b) => b._id === this.currentProfileBudget!._id,
        ),
      }))
      .filter((cb) => cb.budgets.length > 0);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['profileBudget'] && this.profileBudget.length > 0) {
      this.currentProfileBudget = this.profileBudget[0];
    }
    if(changes['categoryBudgets']){
      console.log(this.currentCategoryBudgets);
    }
  }
}
