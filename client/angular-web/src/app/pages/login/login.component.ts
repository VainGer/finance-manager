import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ErrorComponent } from '../../components/ui/error/error.component';
import ApiProvider from '../../../services/api.service';
import AuthService from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, ErrorComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private api = inject(ApiProvider);
  private authService = inject(AuthService);
  private router = inject(Router);
  loginForm: FormGroup;
  error: string | undefined;

  constructor() {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.error = undefined;
      let { username, password } = this.loginForm.value;
      username = username.trim().toLowerCase();
      password = password.trim();
      if (password.length < 6 || username.length < 4) {
        this.handleError(400);
        return;
      }
      this.api.post('account/validate', { username, password }).subscribe({
        next: (response) => {
          if (response.ok) {
            const { _id, username } = response['account'];
            this.authService.setAccount({ _id, username });
            this.router.navigate(['/profiles']);
          }
        },
        error: (err) => {
          this.handleError(err.status, username);
        },
      });
    }
  }

  handleError(status?: number, username?: string) {
    switch (status) {
      case 400:
        this.error = 'נא למלא את כל השדות';
        this.loginForm.setValue({
          username: '',
          password: '',
        });
        break;
      case 401:
        this.error = 'שם משתמש או סיסמא שגויים';
        this.loginForm.setValue({
          username: username,
          password: '',
        });
        break;
      default:
        this.error = 'תקלה בשרת, אנא נסה שוב מאוחר יותר';
    }
  }
}
