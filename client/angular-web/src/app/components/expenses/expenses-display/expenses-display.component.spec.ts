import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpensesDisplayComponent } from './expenses-display.component';

describe('ExpensesDisplayComponent', () => {
  let component: ExpensesDisplayComponent;
  let fixture: ComponentFixture<ExpensesDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpensesDisplayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpensesDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
