import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Budget } from '../../../../../types';
import { formatDate } from '../../../../../utils/formatters';
import ApiProvider from '../../../../../services/api.service';
import AuthService from '../../../../../services/auth.service';
import ProfileDataService from '../../../../../services/profileData.service';

type Phase = 'choice' | 'submit';

@Component({
  selector: 'app-delete-budget',
  imports: [],
  templateUrl: './delete-budget.component.html',
  styleUrl: './delete-budget.component.css',
})
export class DeleteBudgetComponent implements OnInit, OnDestroy {
  private api = inject(ApiProvider);
  private auth = inject(AuthService);
  private pData = inject(ProfileDataService);
  private sub: Subscription | undefined;

  phase: Phase = 'choice';
  budgets: Budget[] = [];
  selectedBudgetId: string = '';

  get selectedBudget(): Budget | undefined {
    return this.budgets.find((b) => b._id === this.selectedBudgetId);
  }

  ngOnInit() {
    this.sub = this.pData.profileBudgets$.subscribe((budgets) => {
      this.budgets = budgets;
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  formatDate = formatDate;

  proceedToDelete(event: Event) {
    event.preventDefault();
    if (!this.selectedBudgetId) return;
    this.phase = 'submit';
  }

  handleDelete() {
    const account = this.auth.getAccount();
    const profile = this.auth.getProfile();
    this.api
      .delete(
        `budgets/delete-budget/${encodeURIComponent(account!.username)}/${encodeURIComponent(profile!.profileName)}/${this.selectedBudgetId}`,
      )
      .subscribe({
        next: () => {
          this.pData.fetchBudgets();
        },
        error(_err) {
          console.log('default server error');
        },
      });
  }
}