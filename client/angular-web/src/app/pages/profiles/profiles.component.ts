import { Component, inject } from '@angular/core';
import { CreateProfileComponent } from '../../components/profile/create-profile/create-profile.component';
import { ProfileSelectorComponent } from '../../components/profile/profile-selector/profile-selector.component';
import { ProfileAuthFormComponent } from '../../components/profile/profile-auth-form/profile-auth-form.component';
import { OnInit } from '@angular/core';
import ApiProvider from '../../../services/api.service';
import AuthService from '../../../services/auth.service';
import { Account, ProfileForList } from '../../../types';
import { LoadingComponent } from '../../components/loading/loading.component';
import { ErrorComponent } from '../../components/error/error.component';

type PageState =
  | 'profile-select'
  | 'profile-create'
  | 'profile-auth'
  | 'loading'
  | 'fetch-error';

@Component({
  selector: 'app-profiles',
  imports: [
    CreateProfileComponent,
    ProfileSelectorComponent,
    ProfileAuthFormComponent,
    LoadingComponent,
    ErrorComponent,
  ],
  templateUrl: './profiles.component.html',
  styleUrl: './profiles.component.css',
})
export class ProfilesComponent implements OnInit {
  private api = inject(ApiProvider);
  private auth = inject(AuthService);
  pageState: PageState = 'loading';
  account: Account | null = null;
  profiles: ProfileForList[] | null = null;
  selectedProfile: ProfileForList | null = null;
  firstProfile: boolean = false;
  fetchErr: string | undefined;
  constructor() {
    this.account = this.auth.getAccount();
  }

  //fetch profile list on init
  ngOnInit(): void {
    if (!this.account) {
      return;
    }
    this.api
      .get(
        `profile/get-profiles?username=${encodeURIComponent(
          this.account.username,
        )}`,
      )
      .subscribe({
        next: (response) => {
          if (response.ok) {
            this.profiles = response['profiles'];
            if (this.profiles?.length === 0) {
              this.pageState = 'profile-create';
              this.firstProfile = true;
              return;
            }
            this.pageState = 'profile-select';
          }
        },
        error: (err) => {
          this.pageState = 'fetch-error';
          this.fetchErr = 'שגיאה בטעינת פרופילים, נסה שנית מאוחר יותר';
          console.log('Error fetching profiles', err);
        },
      });
  }

  onProfileClick(profile: ProfileForList) {
    this.selectedProfile = profile;
    this.pageState = 'profile-auth';
  }

  onBackToList() {
    this.pageState = 'profile-select';
    this.selectedProfile = null;
  }
}
