import { Component, inject } from '@angular/core';
import { CategorySelectComponent } from '../../selects/category-select/category-select.component';
import { BusinessSelectComponent } from '../../selects/business-select/business-select.component';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import ApiProvider from '../../../../services/api.service';
import AuthService from '../../../../services/auth.service';
import ProfileDataService from '../../../../services/profileData.service';

@Component({
  selector: 'app-add-transaction',
  imports: [
    CategorySelectComponent,
    BusinessSelectComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './add-transaction.component.html',
  styleUrl: './add-transaction.component.css',
})
export class AddTransactionComponent {
  selectedCategory: string = '';
  selectedBusiness: string = '';
  private fb = inject(FormBuilder);
  private api = inject(ApiProvider);
  private auth = inject(AuthService);
  private pData = inject(ProfileDataService);
  addTransactionForm: FormGroup;

  constructor() {
    this.addTransactionForm = this.fb.group({
      amount: [0, [Validators.required, Validators.min(0)]],
      date: ['', [Validators.required]],
      description: [''],
    });
  }

  setCategory(category: string) {
    this.selectedCategory = category;
  }

  setBusiness(bussiness: string) {
    this.selectedBusiness = bussiness;
  }

  addTransaction() {
    const { amount, date, description } = this.addTransactionForm.value;
    const payload = {
      refId: this.auth.getProfile()?.expenses,
      catName: this.selectedCategory,
      busName: this.selectedBusiness,
      transaction: {
        amount: Number(amount),
        date: new Date(date).toISOString(),
        description,
      },
    };
    this.api.post('expenses/transaction/create', payload).subscribe({
      next: (response) => {
        console.log('success');
        this.pData.fetchAllData();
      },
      error(err) {
        console.log('server error');
      },
    });
  }
}
