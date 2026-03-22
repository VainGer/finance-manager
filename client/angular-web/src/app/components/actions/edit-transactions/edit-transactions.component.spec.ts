import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTransactionsComponent } from './edit-transactions.component';

describe('EditTransactionsComponent', () => {
  let component: EditTransactionsComponent;
  let fixture: ComponentFixture<EditTransactionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditTransactionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
