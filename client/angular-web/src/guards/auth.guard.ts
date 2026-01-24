import { inject, Inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import AuthService from '../services/auth.service';

export const accountGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const account = auth.getAccount();

  if (!account) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};

export const profileGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const account = auth.getAccount();
  const profile = auth.getProfile();

  if (!account) {
    router.navigate(['/login']);
    return false;
  }

  if (!profile) {
    router.navigate(['/profiles']);
    return false;
  }

  return true;
};