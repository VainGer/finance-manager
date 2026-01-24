import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpensesGraphsComponent } from './expenses-graphs.component';

describe('ExpensesGraphsComponent', () => {
  let component: ExpensesGraphsComponent;
  let fixture: ComponentFixture<ExpensesGraphsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpensesGraphsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpensesGraphsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
