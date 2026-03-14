import { Component, inject } from '@angular/core';
import { CategorySelectComponent } from '../../../selects/category-select/category-select.component';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import ApiProvider from '../../../../../services/api.service';
import AuthService from '../../../../../services/auth.service';
import ProfileDataService from '../../../../../services/profileData.service';

@Component({
  selector: 'app-rename-category',
  imports: [CategorySelectComponent, ReactiveFormsModule],
  templateUrl: './rename-category.component.html',
  styleUrl: './rename-category.component.css',
})
export class RenameCategoryComponent {
  private api = inject(ApiProvider);
  private auth = inject(AuthService);
  private pData = inject(ProfileDataService);
  private fb = inject(FormBuilder);
  renameForm: FormGroup;
  oldName: string = '';

  constructor() {
    this.renameForm = this.fb.group({
      newName: ['', [Validators.required, Validators.minLength(2)]],
    });
  }

  setOldName(name: string) {
    this.oldName = name;
  }

  submitRename() {
    const refId = this.auth.getProfile()?.expenses;
    let { newName } = this.renameForm.value;
    newName = newName.trim();
    this.api
      .put('expenses/category/rename', {
        refId,
        oldName: this.oldName,
        newName,
      })
      .subscribe({
        next: (response) => {
          console.log('success');
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
