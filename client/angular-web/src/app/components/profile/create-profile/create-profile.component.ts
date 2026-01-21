import { Component, inject, Input } from '@angular/core';
import { Account } from '../../../../types';
import { ColorPickerComponent } from '../../color-picker/color-picker.component';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import ApiProvider from '../../../../services/api.service';

type NewProfilePayload = {
  username: string;
  profileName: string;
  pin: string;
  avatar: string | null;
  color: string | null;
  parentProfile: boolean;
};

@Component({
  selector: 'app-create-profile',
  imports: [ColorPickerComponent, ReactiveFormsModule],
  templateUrl: './create-profile.component.html',
  styleUrl: './create-profile.component.css',
})
export class CreateProfileComponent {
  @Input() account: Account | null = null;
  @Input() firstProfile: boolean = false;
  fb: FormBuilder = inject(FormBuilder);
  api: ApiProvider = inject(ApiProvider);
  profileForm: FormGroup;
  color: string | null = null;
  avatarFile: File | null = null;

  constructor() {
    this.profileForm = this.fb.group({
      profileName: ['', [Validators.required, Validators.minLength(2)]],
      pin: [
        '',
        [Validators.required, Validators.minLength(4), Validators.maxLength(4)],
      ],
      parentProfile: [this.firstProfile],
    });
  }

  onColorClick(c: string) {
    this.color = c;
  }

  onAvatarPick(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || !(input.files.length > 0)) {
      return;
    }
    this.avatarFile = input.files[0];
  }

  async onSubmit() {
    if (!this.account) {
      return;
    }
    let { profileName, pin, parentProfile } = this.profileForm.value;
    let avatar: string | null = null;
    if (this.avatarFile) {
      avatar = await this.prepareImage(this.avatarFile);
    }
    parentProfile = this.firstProfile ? true : parentProfile;
    const payload: NewProfilePayload = {
      username: this.account.username,
      profileName,
      pin,
      parentProfile: this.firstProfile ? true : parentProfile,
      avatar,
      color: this.color,
    };
    const uri = this.firstProfile
      ? 'create-first-profile'
      : parentProfile
        ? 'create-profile'
        : 'create-child-profile';
    this.api.post(`profile/${uri}`, payload).subscribe({
      next: (response) => {
        if (response.ok) {
          window.location.reload();
        }
      },
      error: (err) => {
        //TODO
        console.log('handle error');
      },
    });
  }

  private prepareImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}
