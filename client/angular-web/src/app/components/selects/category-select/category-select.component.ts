import { Component, inject, Output, EventEmitter } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import ProfileDataService from '../../../../services/profileData.service';

@Component({
  selector: 'app-category-select',
  imports: [AsyncPipe],
  templateUrl: './category-select.component.html',
  styleUrl: './category-select.component.css',
})
export class CategorySelectComponent {
  pdService = inject(ProfileDataService);
  catAndBisNames$ = this.pdService.categoryAndBusinessNames$;
  @Output() onChange = new EventEmitter<string>();

  handleChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.onChange.emit(target.value);
  }
}
