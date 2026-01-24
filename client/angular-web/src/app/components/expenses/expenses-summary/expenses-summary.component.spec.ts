import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpensesSummaryComponent } from './expenses-summary.component';

describe('ExpensesSummaryComponent', () => {
  let component: ExpensesSummaryComponent;
  let fixture: ComponentFixture<ExpensesSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpensesSummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpensesSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
