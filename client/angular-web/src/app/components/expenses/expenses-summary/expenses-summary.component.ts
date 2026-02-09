import { Component, inject, Input, OnInit } from '@angular/core';
import { KeyValuePipe } from '@angular/common';
import { Category, ExpenseSummary, FlattenedExpenses } from '../../../../types';
import { ExpenseService } from '../../../../services/expenses.service';
import * as formatters from '../../../../utils/formatters';

type breakdownView = 'categories' | 'businesses';

@Component({
  selector: 'app-expenses-summary',
  imports: [KeyValuePipe],
  templateUrl: './expenses-summary.component.html',
  styleUrl: './expenses-summary.component.css',
})
export class ExpensesSummaryComponent implements OnInit {
  preserveOrder = () => 0;
  @Input() expenses: Category[] = [];
  expensesService = inject(ExpenseService);
  flatExpenses: FlattenedExpenses[] = [];
  availableDates: Set<string> = new Set();
  monthlyExpenses: Record<string, FlattenedExpenses[]> = {};
  breakdownView: breakdownView = 'categories';
  selectedDate: string | null = null;
  protected formatters = formatters;

  get viewCategories(): boolean {
    return this.breakdownView === 'categories';
  }

  get summaryInfo(): ExpenseSummary | null {
    if (!this.flatExpenses || !this.monthlyExpenses) {
      return null;
    }
    let expensesToProccess: FlattenedExpenses[] = this.selectedDate
      ? this.expensesService.filterByDate(
          this.monthlyExpenses,
          this.selectedDate,
        )
      : [...this.flatExpenses];
    return this.expensesService.makeSummary(
      expensesToProccess,
      this.viewCategories,
    );
  }

  ngOnInit(): void {
    const { flatExpenses, monthlyExpenses, availableDates } =
      this.expensesService.processExpenses(this.expenses);
    this.flatExpenses = [...flatExpenses];
    this.monthlyExpenses = monthlyExpenses;
    this.availableDates = availableDates;
  }

  setView(value: breakdownView) {
    this.breakdownView = value;
  }
  setDate(event: Event) {
    const target = event.target as HTMLSelectElement;
    const value = target.value;
    this.selectedDate = value;
  }
}
