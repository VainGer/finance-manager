import { ExpenseService } from '../../../../services/expenses.service';
import { Category, ExpenseSummary, FlattenedExpenses } from '../../../../types';
import { Component, inject, Input, OnInit } from '@angular/core';
import { PieChartComponent } from '../charts/pie/pie.component';
import * as formatters from '../../../../utils/formatters';
import { BarComponent } from '../charts/bar/bar.component';
type chartType = 'categoryBreakdown' | 'monthlyComparison';
@Component({
  selector: 'app-expenses-graphs',
  imports: [PieChartComponent, BarComponent],
  templateUrl: './expenses-graphs.component.html',
  styleUrl: './expenses-graphs.component.css',
})
export class ExpensesGraphsComponent implements OnInit {
  @Input() expenses: Category[] = [];
  private expensesService = inject(ExpenseService);
  flatExpenses: FlattenedExpenses[] = [];
  monthlyExpenses: Record<string, FlattenedExpenses[]> = {};
  availableDates: Set<string> = new Set<string>();
  chosenDate: string | null = null;
  chartToShow: chartType = 'categoryBreakdown';
  formatters = formatters;
  currentSummary: ExpenseSummary | null = null;
  barChart: Record<string, number> = {};
  get pieChart() {
    return this.currentSummary?.itemSummary || {};
  }

  get numOfItems() {
    return this.currentSummary?.numberOfItems || 0;
  }

  ngOnInit(): void {
    const { flatExpenses, monthlyExpenses, availableDates } =
      this.expensesService.processExpenses(this.expenses);
    this.flatExpenses = flatExpenses;
    this.monthlyExpenses = monthlyExpenses;
    this.availableDates = availableDates;
    this.updatePieChart();
    this.makeBarChart();
  }

  setChartType(chart: chartType) {
    this.chartToShow = chart;
  }

  setDate(e: Event) {
    const target = e.target as HTMLSelectElement;
    this.chosenDate = target.value || null;
    this.updatePieChart();
  }

  private makeBarChart() {
    const sortedMonths = Array.from(this.availableDates).sort().slice(-6);
    sortedMonths.forEach((month) => {
      const totalSum = this.monthlyExpenses[month].reduce(
        (sum, expense) => sum + expense.amount,
        0,
      );
      this.barChart[month] = totalSum;
    });
  }

  private updatePieChart() {
    const expensesToProcess = this.chosenDate
      ? this.monthlyExpenses[this.chosenDate]
      : this.flatExpenses;
    this.currentSummary = this.expensesService.makeSummary(
      expensesToProcess,
      true,
    );
  }
}
