import { Observable, BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Account, Profile } from '../types';

@Injectable({
  providedIn: 'root',
})
export default class AuthService {
  private accountSubject = new BehaviorSubject<Account | null>(null);
  public account$: Observable<Account | null> =
    this.accountSubject.asObservable();

  private profileSubject = new BehaviorSubject<Profile | null>(null);
  public profile$: Observable<Profile | null> =
    this.profileSubject.asObservable();

  constructor() {
    const savedAccount = localStorage.getItem('account');
    const savedProfile = localStorage.getItem('profile');
    if (savedAccount) {
      this.accountSubject.next(JSON.parse(savedAccount));
    }
    if (savedProfile) {
      this.profileSubject.next(JSON.parse(savedProfile));
    }
  }

  setAccount(acc: Account) {
    this.accountSubject.next(acc);
    localStorage.setItem('account', JSON.stringify(acc));
  }

  setProfile(p: Profile) {
    this.profileSubject.next(p);
    localStorage.setItem('profile', JSON.stringify(p));
  }

  getAccount(): Account | null {
    return this.accountSubject.value;
  }

  getProfile(): Profile | null {
    return this.profileSubject.value;
  }

  clearAccount() {
    this.accountSubject.next(null);
    localStorage.removeItem('account');
  }

  clearProfile() {
    this.profileSubject.next(null);
    localStorage.removeItem('profile');
  }
}
