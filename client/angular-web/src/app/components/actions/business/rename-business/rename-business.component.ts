import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CategorySelectComponent } from '../../../selects/category-select/category-select.component';
import { BusinessSelectComponent } from '../../../selects/business-select/business-select.component';
import ApiProvider from '../../../../../services/api.service';
import AuthService from '../../../../../services/auth.service';
import ProfileDataService from '../../../../../services/profileData.service';

@Component({
  selector: 'app-rename-business',
  imports: [ReactiveFormsModule, CategorySelectComponent, BusinessSelectComponent],
  templateUrl: './rename-business.component.html',
  styleUrl: './rename-business.component.css',
})
export class RenameBusinessComponent {
  private api = inject(ApiProvider);
  private auth = inject(AuthService);
  private pData = inject(ProfileDataService);
  private fb = inject(FormBuilder);

  renameForm: FormGroup;
  selectedCategory: string = '';
  selectedBusiness: string = '';

  constructor() {
    this.renameForm = this.fb.group({
      newName: ['', [Validators.required, Validators.minLength(2)]],
    });
  }

  setCategory(category: string) {
    this.selectedCategory = category;
    this.selectedBusiness = '';
  }

  setBusiness(business: string) {
    this.selectedBusiness = business;
  }

  submitRename() {
    const refId = this.auth.getProfile()?.expenses;
    let { newName } = this.renameForm.value;
    newName = newName.trim();
    this.api
      .put('expenses/business/rename', {
        refId,
        catName: this.selectedCategory,
        oldName: this.selectedBusiness,
        newName,
      })
      .subscribe({
        next: () => {
          this.pData.fetchAllData();
        },
        error(err) {
          if (err.status === 400) {
            console.log('name exists');
            return;
          }
          console.log('default server error');
        },
      });
  }
}