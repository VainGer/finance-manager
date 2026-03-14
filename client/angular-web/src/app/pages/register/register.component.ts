import { Component, inject } from '@angular/core';
import ApiProvider from '../../../services/api.service';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  private api = inject(ApiProvider);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  registerForm: FormGroup;

  constructor() {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  handleRegister() {
    const { username, password, confirmPassword } = this.registerForm.value;
    if (!username || !password || !confirmPassword) {
      return;
    }
    if (password !== confirmPassword) {
      return;
    }
    if (password.length < 6) {
      return;
    }
    this.api.post('account/register', { username, password }).subscribe({
      next: (response) => {
        console.log('success message');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        if (err.status === 409) {
          console.log('handle existing user');
          return;
        }
        console.log('handle server error');
      },
    });
  }
}
