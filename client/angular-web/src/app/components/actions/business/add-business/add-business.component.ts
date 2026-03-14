import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CategorySelectComponent } from '../../../selects/category-select/category-select.component';
import ApiProvider from '../../../../../services/api.service';
import AuthService from '../../../../../services/auth.service';
import ProfileDataService from '../../../../../services/profileData.service';

@Component({
  selector: 'app-add-business',
  imports: [ReactiveFormsModule, CategorySelectComponent],
  templateUrl: './add-business.component.html',
  styleUrl: './add-business.component.css',
})
export class AddBusinessComponent {
  private api = inject(ApiProvider);
  private auth = inject(AuthService);
  private pData = inject(ProfileDataService);
  private fb = inject(FormBuilder);

  addForm: FormGroup;
  selectedCategory: string = '';

  constructor() {
    this.addForm = this.fb.group({
      businessName: ['', [Validators.required, Validators.minLength(2)]],
    });
  }

  setCategory(category: string) {
    this.selectedCategory = category;
  }

  submitAdd() {
    const refId = this.auth.getProfile()?.expenses;
    const { businessName } = this.addForm.value;
    if (!businessName?.trim() || !this.selectedCategory) return;
    this.api
      .post('expenses/business/add', {
        refId,
        catName: this.selectedCategory,
        name: businessName.trim(),
      })
      .subscribe({
        next: () => {
          this.pData.fetchAllData();
        },
        error(err) {
          if (err.status === 409) {
            console.log('business exists');
            return;
          }
          console.log('default server error');
        },
      });
  }
}