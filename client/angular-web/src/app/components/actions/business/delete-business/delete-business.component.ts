import { Component, inject } from '@angular/core';
import { CategorySelectComponent } from '../../../selects/category-select/category-select.component';
import { BusinessSelectComponent } from '../../../selects/business-select/business-select.component';
import ApiProvider from '../../../../../services/api.service';
import AuthService from '../../../../../services/auth.service';
import ProfileDataService from '../../../../../services/profileData.service';

type Phase = 'choice' | 'submit';

@Component({
  selector: 'app-delete-business',
  imports: [CategorySelectComponent, BusinessSelectComponent],
  templateUrl: './delete-business.component.html',
  styleUrl: './delete-business.component.css',
})
export class DeleteBusinessComponent {
  private api = inject(ApiProvider);
  private auth = inject(AuthService);
  private pData = inject(ProfileDataService);

  phase: Phase = 'choice';
  selectedCategory: string = '';
  selectedBusiness: string = '';

  setCategory(category: string) {
    this.selectedCategory = category;
    this.selectedBusiness = '';
  }

  setBusiness(business: string) {
    this.selectedBusiness = business;
  }

  proceedToDelete(event: Event) {
    event.preventDefault();
    this.phase = 'submit';
  }

  handleDelete() {
    const refId = this.auth.getProfile()?.expenses;
    this.api
      .delete(
        `expenses/business/delete/${refId}/${this.selectedCategory}/${this.selectedBusiness}`,
      )
      .subscribe({
        next: () => {
          this.pData.fetchAllData();
        },
        error(err) {
          console.log('default server error');
        },
      });
  }
}