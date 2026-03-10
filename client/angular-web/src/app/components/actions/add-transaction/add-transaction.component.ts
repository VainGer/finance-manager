import { Component } from '@angular/core';
import { CategorySelectComponent } from '../../selects/category-select/category-select.component';
import { BusinessSelectComponent } from '../../selects/business-select/business-select.component';

@Component({
  selector: 'app-add-transaction',
  imports: [CategorySelectComponent, BusinessSelectComponent],
  templateUrl: './add-transaction.component.html',
  styleUrl: './add-transaction.component.css',
})
export class AddTransactionComponent {
  selectedCategory: string = '';
  selectedBusiness: string = '';

  setCategory(category: string) {
    this.selectedCategory = category;
  }

  setBusiness(bussiness: string) {
    this.selectedBusiness = bussiness;
  }
}
