import { Component, Input, SimpleChanges } from '@angular/core';
import { Budget, CategoryBudget } from '../../../../types';
import * as formatters from '../../../../utils/formatters';

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
  protected formatters = formatters;

  get currentCategoryBudgets(): Array<{ name: string; budget: Budget }> {
    if (!this.currentProfileBudget) return [];

    return this.categoryBudgets
      .map((cb) => ({
        name: cb.name,
        budget: cb.budgets.find(
          (b) => b._id === this.currentProfileBudget!._id,
        ),
      }))
      .filter(
        (item): item is { name: string; budget: Budget } =>
          item.budget !== undefined,
      );
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['profileBudget'] && this.profileBudget.length > 0) {
      this.currentProfileBudget = this.profileBudget[0];
    }
  }

  setCurrentBudgets(event: Event) {
    const target = event.target as HTMLSelectElement;
    const seelctedId = target.value;
    this.currentProfileBudget = this.profileBudget.find(
      (pb) => pb._id === seelctedId,
    );
  }
}
