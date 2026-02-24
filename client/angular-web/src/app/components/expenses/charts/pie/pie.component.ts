import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import {
  ApexChart,
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexDataLabels,
} from 'ng-apexcharts';

type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  responsive: ApexResponsive[];
  dataLabels: ApexDataLabels;
};

@Component({
  selector: 'app-pie-chart',
  imports: [NgApexchartsModule],
  template: `
    <apx-chart
      [series]="chartOptions.series"
      [chart]="chartOptions.chart"
      [labels]="chartOptions.labels"
      [responsive]="chartOptions.responsive"
      [dataLabels]="chartOptions.dataLabels"
    ></apx-chart>
  `,
})
export class PieChartComponent implements OnInit, OnChanges {
  @Input() data: Record<string, { totalSum: number }> = {};
  @Input() title: string = 'גרף עוגה';

  chartOptions!: ChartOptions;

  ngOnInit() {
    this.updateChart();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] && !changes['data'].firstChange) {
      this.updateChart();
    }
  }

  private updateChart() {
    this.chartOptions = {
      series: Object.values(this.data).map((item) => item.totalSum),
      labels: Object.keys(this.data),
      chart: {
        type: 'pie',
        width: '100%',
        height: 500,
      },
      dataLabels: {
        enabled: true,
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: { width: 200 },
          },
        },
      ],
    };
  }
}
