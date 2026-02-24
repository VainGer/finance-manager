import { Observable, BehaviorSubject, firstValueFrom } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import {
  Account,
  CategoriesAndBusinesses,
  Category,
  HistoryResponse,
  Profile,
} from '../types';
import AuthService from './auth.service';
import ApiProvider from './api.service';
import { Budget, CategoryBudget } from '../types';

type status = 'idle' | 'processing' | 'completed' | 'error';

@Injectable({
  providedIn: 'root',
})
export default class ProfileDataService {
  private categoryBudgetsSubject = new BehaviorSubject<CategoryBudget[]>([]);
  private profileBudgetsSubject = new BehaviorSubject<Budget[]>([]);
  private profileExpensesSubject = new BehaviorSubject<Category[]>([]);
  private categoriesAndBusinessesSubject = new BehaviorSubject<
    CategoriesAndBusinesses[]
  >([]);
  private aiHistorySubject = new BehaviorSubject<HistoryResponse | null>(null);
  private newAiReadySubject = new BehaviorSubject<boolean>(false);
  private isDataFetchedSubject = new BehaviorSubject<boolean>(false);
  public categoryBudgets$: Observable<CategoryBudget[]> =
    this.categoryBudgetsSubject.asObservable();
  public profileBudgets$: Observable<Budget[]> =
    this.profileBudgetsSubject.asObservable();
  public profileExpenses$: Observable<Category[]> =
    this.profileExpensesSubject.asObservable();
  public categoryAndBusinessNames$: Observable<CategoriesAndBusinesses[]> =
    this.categoriesAndBusinessesSubject.asObservable();
  public aiHistory$: Observable<HistoryResponse | null> =
    this.aiHistorySubject.asObservable();
  public isDataFetched$: Observable<boolean> =
    this.isDataFetchedSubject.asObservable();
  pollingInterval: any = null;
  private auth = inject(AuthService);
  private api = inject(ApiProvider);

  private get account(): Account {
    const account = this.auth.getAccount();
    if (!account) {
      throw new Error('No authenticated account');
    }
    return account;
  }

  private get profile(): Profile {
    const profile = this.auth.getProfile();
    if (!profile) {
      throw new Error('No authenticated profile');
    }
    return profile;
  }

  async fetchAllData() {
    await Promise.all([
      this.fetchBudgets(),
      this.fetchExpenses(),
      this.fetchAIHistory(),
    ]);
    this.isDataFetchedSubject.next(true);
    const currentHistory = this.aiHistorySubject.value;
    if (currentHistory?.status === 'processing') {
      this.startPolling();
    }
  }

  async fetchBudgets() {
    const response = await firstValueFrom(
      this.api.get(
        `budgets/get-profile-budgets?username=${encodeURIComponent(this.account.username)}&profileName=${encodeURIComponent(this.profile.profileName)}`,
      ),
    );
    if (response.ok) {
      const profileBudgets: Budget[] = response['profileBudgets'];
      const sortedProfileBudgets = profileBudgets.sort(
        (a: Budget, b: Budget) =>
          new Date(b.endDate).getTime() - new Date(a.endDate).getTime(),
      );
      const categoryBudgets = response['categoryBudgets'];
      this.categoryBudgetsSubject.next(categoryBudgets);
      this.profileBudgetsSubject.next(sortedProfileBudgets);
    } else {
      //TODO ERROR HANDLER
    }
  }

  async fetchExpenses() {
    const response = await firstValueFrom(
      this.api.get(
        `expenses/profile-expenses/${encodeURIComponent(this.profile.expenses)}`,
      ),
    );
    if (response.ok) {
      const rawExpenses: any = response['expenses'];
      const expenses: Category[] = rawExpenses.map((re: any) => ({
        name: re.name,
        Businesses: re.Businesses,
      }));
      this.profileExpensesSubject.next(expenses);
    }
    this.setCategoryNames();
  }

  async fetchAIHistory() {
    const response = await firstValueFrom(
      this.api.get(`ai/history/${this.profile._id}`),
    );
    if (response.ok) {
      this.aiHistorySubject.next(response['history']);
    }
  }

  private async checkStatus() {
    const response = await firstValueFrom(
      this.api.get(`ai/history/status/${this.profile._id}`),
    );
    if (response.ok) {
      const status = response['analyzeStatus'] as status;
      console.log(status);
      if (status === 'completed') {
        this.stopPolling();
        await this.fetchAIHistory();
        this.newAiReadySubject.next(true);
      } else if (status === 'idle' || status === 'error') {
        this.stopPolling();
        await this.fetchAIHistory();
      }
    } else {
      this.stopPolling();
    }
  }

  private async startPolling() {
    this.stopPolling();
    await this.checkStatus();
    if (this.pollingInterval === null) {
      this.pollingInterval = setInterval(() => {
        this.checkStatus();
      }, 3000);
    }
  }

  private stopPolling() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  }

  private setCategoryNames() {
    this.categoriesAndBusinessesSubject.next(
      this.profileExpensesSubject.value.map((c) => ({
        category: c.name,
        businesses: c.Businesses.map((b) => b.name),
      })),
    );
  }
}
