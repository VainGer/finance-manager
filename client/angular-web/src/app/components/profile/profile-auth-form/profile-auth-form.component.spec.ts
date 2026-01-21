import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileAuthFormComponent } from './profile-auth-form.component';

describe('ProfileAuthFormComponent', () => {
  let component: ProfileAuthFormComponent;
  let fixture: ComponentFixture<ProfileAuthFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileAuthFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileAuthFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
