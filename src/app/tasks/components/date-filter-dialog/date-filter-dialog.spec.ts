import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DateFilterDialog } from './date-filter-dialog';

describe('DateFilterDialog', () => {
  let component: DateFilterDialog;
  let fixture: ComponentFixture<DateFilterDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DateFilterDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DateFilterDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
