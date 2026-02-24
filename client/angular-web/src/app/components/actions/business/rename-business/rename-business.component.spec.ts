import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenameBusinessComponent } from './rename-business.component';

describe('RenameBusinessComponent', () => {
  let component: RenameBusinessComponent;
  let fixture: ComponentFixture<RenameBusinessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RenameBusinessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RenameBusinessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
