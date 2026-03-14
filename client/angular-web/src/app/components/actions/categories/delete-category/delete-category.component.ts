import { Component, inject } from '@angular/core';
import { CategorySelectComponent } from '../../../selects/category-select/category-select.component';
import ApiProvider from '../../../../../services/api.service';
import AuthService from '../../../../../services/auth.service';
import ProfileDataService from '../../../../../services/profileData.service';

type Phase = 'choice' | 'submit';
@Component({
  selector: 'app-delete-category',
  imports: [CategorySelectComponent],
  templateUrl: './delete-category.component.html',
  styleUrl: './delete-category.component.css',
})
export class DeleteCategoryComponent {
  private api = inject(ApiProvider);
  private auth = inject(AuthService);
  private pData = inject(ProfileDataService);
  phase: Phase = 'choice';
  selectedCategory: string = '';

  setCategory(category: string) {
    this.selectedCategory = category;
  }

  proceedToDelete(event: Event) {
    event.preventDefault();
    this.phase = 'submit';
  }

  handleDelete() {
    const refId = this.auth.getProfile()?.expenses;
    this.api
      .delete(`expenses/category/delete/${refId}/${this.selectedCategory}`)
      .subscribe({
        next: (response) => {
          console.log('success');
          this.pData.fetchAllData();
        },
        error(err) {
          console.log('default server error');
        },
      });
  }
}
