import { Component, inject, OnInit } from '@angular/core';
import ProfileDataService from '../../../services/profileData.service';
import { ExpensesDisplayComponent } from '../../components/expenses/expenses-display/expenses-display.component';
import { ExpensesSummaryComponent } from '../../components/expenses/expenses-summary/expenses-summary.component';
import { ExpensesGraphsComponent } from '../../components/expenses/expenses-graphs/expenses-graphs.component';
import { BudgetSummaryComponent } from '../../components/budgets/budget-summary/budget-summary.component';
import { InsightsComponent } from '../../components/ai/insights/insights.component';
import { AsyncPipe } from '@angular/common';
import { combineLatest } from 'rxjs';

type dashboardState =
  | 'fetch-error'
  | 'expenses-display'
  | 'expenses-summary'
  | 'graphs'
  | 'insights'
  | 'budgets';

@Component({
  selector: 'app-dashboard',
  imports: [
    AsyncPipe,
    ExpensesDisplayComponent,
    ExpensesSummaryComponent,
    ExpensesGraphsComponent,
    BudgetSummaryComponent,
    InsightsComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  private pdService = inject(ProfileDataService);
  displayState: dashboardState = 'budgets';
  categoryBudgets$ = this.pdService.categoryBudgets$;
  profileBudgets$ = this.pdService.profileBudgets$;
  expenses$ = this.pdService.profileExpenses$;
  catAndBisNames = this.pdService.categoryAndBusinessNames$;
  isDataFetched = this.pdService.isDataFetched$;

  budgetsData$ = combineLatest({
    profile: this.profileBudgets$,
    category: this.categoryBudgets$,
  });

  ngOnInit(): void {
    this.pdService.fetchAllData();
  }

  setState(state: dashboardState) {
    this.displayState = state;
  }
}
