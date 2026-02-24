import { Component, Input, OnInit } from '@angular/core';
import { History } from '../../../../types';
import * as formatters from '../../../../utils/formatters';
@Component({
  selector: 'app-insights',
  imports: [],
  templateUrl: './insights.component.html',
  styleUrl: './insights.component.css',
})
export class InsightsComponent implements OnInit {
  @Input() history: History[] | undefined = [];
  availableDates: string[] = [];
  chosenDate: string | null = null;

  get historyToDisplay(): History | undefined {
    if (!this.history || this.history.length === 0) {
      return undefined;
    }
    if (this.chosenDate) {
      const [start, _] = this.chosenDate.split(`-`);
      return this.history.find(
        (h) =>
          new Date(formatters.formatDate(h.startDate)).getTime() ===
          new Date(start).getTime(),
      );
    }
    return this.history[0];
  }

  ngOnInit(): void {
    if (!this.history) {
      return;
    }
    this.history.sort(
      (h) => new Date(h.startDate).getTime() - new Date(h.startDate).getTime(),
    );
    this.history.forEach((h) => {
      this.availableDates.push(
        `${formatters.formatDate(h.startDate)} - ${formatters.formatDate(h.endDate)}`,
      );
    });
  }

  setDate(event: Event) {
    const target = event.target as HTMLSelectElement;
    const value = target.value;
    this.chosenDate = value;
  }
}
