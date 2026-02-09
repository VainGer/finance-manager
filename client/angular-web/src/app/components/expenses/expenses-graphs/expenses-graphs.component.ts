import { Category } from '../../../../types';
import { Component, Input } from '@angular/core';

type chartType = 'categoryBreakdown' | 'monthlyComparison';
@Component({
  selector: 'app-expenses-graphs',
  imports: [],
  templateUrl: './expenses-graphs.component.html',
  styleUrl: './expenses-graphs.component.css',
})
export class ExpensesGraphsComponent {
  @Input() expenses: Category[] = [];
  chartToShow: chartType = 'categoryBreakdown';

  setChartType(chart:chartType){
    this.chartToShow = chart;
  }
}
