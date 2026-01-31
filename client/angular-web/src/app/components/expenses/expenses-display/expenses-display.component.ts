import { Component, inject, Input, OnInit, SimpleChange } from '@angular/core';
import { Category, FlattenedExpenses } from '../../../../types';
import * as formatters from '../../../../utils/formatters';
import { ExpenseService } from '../../../../services/expenses.service';

type DisplaySummary = {
  trsNum: number;
  trsSum: number;
  avgTrs: number;
};

@Component({
  selector: 'app-expenses-display',
  imports: [],
  templateUrl: './expenses-display.component.html',
  styleUrl: './expenses-display.component.css',
})
export class ExpensesDisplayComponent implements OnInit {
  @Input() expenses: Category[] = [];
  private expensesService = inject(ExpenseService);
  flatExpenses: FlattenedExpenses[] = [];
  monthlyExpenses: Record<string, FlattenedExpenses[]> = {};
  expensesToDisplay: FlattenedExpenses[] = [];
  availableDates: Set<string> = new Set<string>();
  selectedCategory: string | null = null;
  selectedBusiness: string | null = null;
  selectedDate: string | null = null;
  descendingDateSort: boolean = false;
  descendingAmountSort: boolean = false;
  protected formatters = formatters;

  get summaryInfo(): DisplaySummary {
    const sum: number = this.expensesToDisplay.reduce(
      (sum, expense) => sum + expense.amount,
      0,
    );
    const avg: number = sum / this.expensesToDisplay.length;
    return {
      trsNum: this.expensesToDisplay.length,
      trsSum: sum,
      avgTrs: avg,
    };
  }

  get availableCategories(): Set<string> {
    const categories: Set<string> = new Set();
    this.expensesToDisplay.forEach((e) => categories.add(e.category));
    return categories;
  }

  get availableBusinesses(): Set<string> | null {
    if (!this.selectedCategory) {
      return null;
    }
    const businesses: Set<string> = new Set();
    this.expensesToDisplay.forEach((e) => {
      if (e.category === this.selectedCategory) {
        businesses.add(e.business);
      }
    });
    return businesses;
  }

  setSelectedCategory(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedCategory = target.value || null;
  }

  setSelectedBusiness(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedBusiness = target.value || null;
  }

  setSelectedDate(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedDate = target.value || null;
  }

  filterExpenses(activate: boolean) {
    if (!activate) {
      this.selectedDate = null;
      this.selectedCategory = null;
      this.selectedBusiness = null;
      this.expensesToDisplay = this.flatExpenses;
      this.descendingDateSort = false;
      this.descendingAmountSort = false;
      return;
    }
    let tempExpenses: FlattenedExpenses[] = [...this.flatExpenses];
    if (this.selectedDate) {
      tempExpenses = this.filterByDate();
    }
    if (this.selectedCategory) {
      tempExpenses = this.filterByCategory(tempExpenses);
    }
    if (this.selectedBusiness) {
      tempExpenses = this.filterByBusiness(tempExpenses);
    }
    this.expensesToDisplay = tempExpenses;
  }

  filterByDate() {
    return [...this.monthlyExpenses[this.selectedDate!]];
  }

  filterByCategory(expenses: FlattenedExpenses[]) {
    return expenses.filter((e) => e.category === this.selectedCategory);
  }

  filterByBusiness(expenses: FlattenedExpenses[]) {
    return expenses.filter((e) => e.business === this.selectedBusiness);
  }

  sortByDate() {
    if (this.descendingDateSort) {
      this.expensesToDisplay.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      );
    } else {
      this.expensesToDisplay.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      );
    }
    this.descendingDateSort = !this.descendingDateSort;
  }

  sortByAmount() {
    if (this.descendingAmountSort) {
      this.expensesToDisplay.sort((a, b) => b.amount - a.amount);
    } else {
      this.expensesToDisplay.sort((a, b) => a.amount - b.amount);
    }
    this.descendingAmountSort = !this.descendingAmountSort;
  }

  ngOnInit(): void {
    const { flatExpenses, monthlyExpenses, availableDates } =
      this.expensesService.processExpenses(this.expenses);
    this.flatExpenses = flatExpenses;
    this.monthlyExpenses = monthlyExpenses;
    this.availableDates = availableDates;
    this.expensesToDisplay = [...flatExpenses];
  }
}
