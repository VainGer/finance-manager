import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ProfilesComponent } from './pages/profiles/profiles.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { accountGuard, profileGuard } from '../guards/auth.guard';

export const routes: Routes = [
  //no authentication routes
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  //account requiered path
  {
    path: 'profiles',
    component: ProfilesComponent,
    canActivate: [accountGuard],
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [profileGuard],
  },
];
