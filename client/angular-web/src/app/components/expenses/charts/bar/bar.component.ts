import { Component, OnInit, Input } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import {
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexPlotOptions,
  ApexAxisChartSeries,
} from 'ng-apexcharts';
import * as formatters from '../../../../../utils/formatters';

type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  colors: string[];
};

@Component({
  selector: 'app-bar',
  imports: [NgApexchartsModule],
  template: `
    <apx-chart
      [series]="chartOptions.series"
      [chart]="chartOptions.chart"
      [xaxis]="chartOptions.xaxis"
      [dataLabels]="chartOptions.dataLabels"
      [plotOptions]="chartOptions.plotOptions"
    ></apx-chart>
  `,
  styleUrl: './bar.component.css',
})
export class BarComponent implements OnInit {
  @Input() data: Record<string, number> = {};
  chartOptions!: ChartOptions;
  private formatters = formatters;

  ngOnInit() {
    this.updateChart();
  }

  private updateChart() {
    const values = Object.values(this.data);
    const min = Math.min(...values);
    const max = Math.max(...values);

    const colors = Object.values(this.data).map((value) => {
      const ratio = (value - min) / (max - min);
      const lightness = 70 - ratio * 40;
      return `hsl(210, 80%, ${lightness}%)`;
    });
    this.chartOptions = {
      series: [
        {
          name: 'מגמות חודשיות',
          data: Object.entries(this.data).map(([month, sum]) => {
            return {
              x: `${formatters.monthToHebrewName(month.split('-')[1])}  -
              ${month.split('-')[0]}`,
              y: sum,
            };
          }),
        },
      ],
      chart: {
        type: 'bar',
        height: 350,
      },
      plotOptions: {
        bar: {
          borderRadius: 10,
          horizontal: false,
          distributed: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        type: 'category',
      },
      colors: colors,
    };
  }
}
