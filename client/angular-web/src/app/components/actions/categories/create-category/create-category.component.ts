import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import AuthService from '../../../../../services/auth.service';
import ApiProvider from '../../../../../services/api.service';
import ProfileDataService from '../../../../../services/profileData.service';

@Component({
  selector: 'app-create-category',
  imports: [ReactiveFormsModule],
  templateUrl: './create-category.component.html',
  styleUrl: './create-category.component.css',
})
export class CreateCategoryComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private api = inject(ApiProvider);
  private pData = inject(ProfileDataService);
  createForm: FormGroup;

  constructor() {
    this.createForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
    });
  }

  submitCreate() {
    const id = this.auth.getProfile()?.expenses;
    const { name } = this.createForm.value;
    console.log(id, name);
    if (!name || name.trim() === '0') {
      console.log('handle name');
      return;
    }
    this.api
      .post('expenses/category/create', {
        refId: id,
        name: name.trim(),
      })
      .subscribe({
        next: (response) => {
          console.log('success');
          this.pData.fetchAllData();
        },
        error(err) {
          if (err.status === 400) {
            console.log('exists error');
            return;
          }
          if (err.status === 404) {
            console.log('profile error');
            return;
          }
          console.log('default server error');
        },
      });
  }
}
