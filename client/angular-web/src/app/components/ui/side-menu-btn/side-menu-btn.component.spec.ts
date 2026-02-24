import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SideMenuBtnComponent } from './side-menu-btn.component';

describe('SideMenuBtnComponent', () => {
  let component: SideMenuBtnComponent;
  let fixture: ComponentFixture<SideMenuBtnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SideMenuBtnComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SideMenuBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
