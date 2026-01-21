import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { Account, ProfileForList } from '../../../../types';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ɵInternalFormsSharedModule,
  ReactiveFormsModule,
} from '@angular/forms';
import ApiProvider from '../../../../services/api.service';
import { Router } from '@angular/router';
import AuthService from '../../../../services/auth.service';

@Component({
  selector: 'app-profile-auth-form',
  imports: [ɵInternalFormsSharedModule, ReactiveFormsModule],
  templateUrl: './profile-auth-form.component.html',
  styleUrl: './profile-auth-form.component.css',
})
export class ProfileAuthFormComponent {
  @Input() selectedProfile: ProfileForList | null = null;
  @Input() account: Account | null = null;
  @Output() goBack = new EventEmitter();
  private fb = inject(FormBuilder);
  private api = inject(ApiProvider);
  private router = inject(Router);
  private auth = inject(AuthService);
  authForm: FormGroup;

  constructor() {
    this.authForm = this.fb.group({
      pin: [
        '',
        [Validators.required, Validators.minLength(4), Validators.maxLength(4)],
      ],
      remember: [false],
    });
  }

  onSubmit() {
    let { pin, remember } = this.authForm.value;
    pin = pin.trim();
    if (!this.selectedProfile) {
      this.back();
    }
    if (!(pin.length === 4)) {
      return;
    }

    this.api
      .post('profile/validate-profile', {
        username: this.account?.username,
        profileName: this.selectedProfile?.profileName,
        pin,
        device: 'ang',
        remember,
      })
      .subscribe({
        next: (response) => {
          const profile = response['profile'];
          this.auth.setProfile(profile);
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          //TODO
          console.log('handle error');
        },
      });
  }

  back() {
    this.goBack.emit();
  }
}
