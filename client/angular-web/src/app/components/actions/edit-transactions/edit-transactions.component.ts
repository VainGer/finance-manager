import { Component, inject, Input, OnInit } from '@angular/core';
import ApiProvider from '../../../../services/api.service';
import { ModalComponent } from '../../ui/modal/modal.component';
import { FlattenedExpenses } from '../../../../types';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { concat, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import ProfileDataService from '../../../../services/profileData.service';
import AuthService from '../../../../services/auth.service';

type EditState = 'edit' | 'confirmDelete' | null;
@Component({
  selector: 'app-edit-transactions',
  imports: [ModalComponent, ReactiveFormsModule],
  templateUrl: './edit-transactions.component.html',
  styleUrl: './edit-transactions.component.css',
})
export class EditTransactionsComponent implements OnInit {
  @Input() transaction!: FlattenedExpenses;
  private fb = inject(FormBuilder);
  private pData = inject(ProfileDataService);
  private auth = inject(AuthService);
  errors: { field: string; status: number; message: string }[] = [];
  api = inject(ApiProvider);
  editForm!: FormGroup;
  state: EditState = null;

  ngOnInit() {
    this.editForm = this.fb.group({
      amount: [this.transaction?.amount],
      date: [this.formatDateForInput(this.transaction.date)],
      description: [this.transaction?.description],
    });
  }
  setState(state: EditState) {
    this.state = state;
    if (state == null) {
      this.resetForm();
    }
  }

  saveChanges() {
    const { amount, date, description } = this.editForm.value;
    const amountChanged = Number(amount) !== this.transaction.amount;
    const dateChanged =
      new Date(date).getTime() !== new Date(this.transaction.date).getTime();
    const descriptionChanged = description !== this.transaction.description;
    const operations = [];
    if (amountChanged) {
      operations.push(
        this.changeAmount(Number(amount)).pipe(
          catchError((err) => {
            this.errors.push({
              field: 'amount',
              status: err.status,
              message: err.message,
            });
            return of(null);
          }),
        ),
      );
    }

    if (descriptionChanged) {
      operations.push(
        this.changeDescription(description).pipe(
          catchError((err) => {
            this.errors.push({
              field: 'description',
              status: err.status,
              message: err.message,
            });
            return of(null);
          }),
        ),
      );
    }
    if (dateChanged) {
      operations.push(
        this.changeDate(date).pipe(
          catchError((err) => {
            this.errors.push({
              field: 'date',
              status: err.status,
              message: err.message,
            });
            return of(null);
          }),
        ),
      );
    }
    if (operations.length > 0) {
      concat(...operations).subscribe({
        complete: () => {
          if (this.errors.length > 0) {
            //TODO errors
          } else {
            this.setState(null);
          }
          this.pData.fetchAllData();
        },
      });
    }
  }

  changeAmount(amount: number) {
    const profile = this.auth.getProfile();
    return this.api.put('expenses/transaction/change-amount', {
      refId: profile?.expenses,
      catName: this.transaction.category,
      busName: this.transaction.business,
      transactionId: this.transaction._id,
      newAmount: amount,
    });
  }

  changeDate(date: string) {
    const newDate = new Date(date);
    const profile = this.auth.getProfile();
    return this.api.put('expenses/transaction/change-date', {
      refId: profile?.expenses,
      catName: this.transaction.category,
      busName: this.transaction.business,
      transactionId: this.transaction._id,
      newDate: newDate.toISOString(),
    });
  }

  changeDescription(description: string) {
    const profile = this.auth.getProfile();
    return this.api.put('expenses/transaction/change-description', {
      refId: profile?.expenses,
      catName: this.transaction.category,
      busName: this.transaction.business,
      transactionId: this.transaction._id,
      newDescription: description,
    });
  }

  deleteTransaction() {
    const profile = this.auth.getProfile();
    this.api
      .delete('expenses/transaction/delete-transaction', {
        refId: profile?.expenses,
        catName: this.transaction.category,
        busName: this.transaction.business,
        transactionId: this.transaction._id,
      })
      .subscribe({
        next: (response) => {
          this.pData.fetchAllData();
        },
        error(err) {},
      });
  }

  resetForm() {
    this.editForm.setValue({
      amount: this.transaction.amount,
      date: this.formatDateForInput(this.transaction.date),
      description: this.transaction.description,
    });
  }

  private formatDateForInput(date: Date | string): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
