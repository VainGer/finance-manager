import {
  Component,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  EventEmitter,
} from '@angular/core';
import ProfileDataService from '../../../../services/profileData.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-business-select',
  imports: [],
  templateUrl: './business-select.component.html',
  styleUrl: './business-select.component.css',
})
export class BusinessSelectComponent implements OnInit, OnDestroy {
  private subscription: Subscription | undefined;
  @Input() selectedCategory: string = '';
  @Output() onChange = new EventEmitter<string>();
  pdService = inject(ProfileDataService);
  catAndBusNames$ = this.pdService.categoryAndBusinessNames$;
  catAndBusNames: { category: string; businesses: string[] }[] = [];

  get businesses() {
    return this.catAndBusNames.find(
      (cb) => cb.category === this.selectedCategory,
    )?.businesses;
  }

  handleChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.onChange.emit(target.value);
  }

  ngOnInit(): void {
    this.subscription = this.catAndBusNames$.subscribe((data) => {
      this.catAndBusNames = data;
    });
  }
  ngOnDestroy(): void {
    this.subscription?.unsubscribe;
  }
}
