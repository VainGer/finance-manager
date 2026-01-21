import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ProfileForList } from '../../../../types';

@Component({
  selector: 'app-profile-selector',
  imports: [],
  templateUrl: './profile-selector.component.html',
  styleUrl: './profile-selector.component.css',
})
export class ProfileSelectorComponent {
  @Input() profileList: ProfileForList[] | null = null;
  @Output() profileSelected = new EventEmitter<ProfileForList>();

  onSelectProfile(profile: ProfileForList) {
    this.profileSelected.emit(profile);
  }
}
