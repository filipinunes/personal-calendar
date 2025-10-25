import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskFormDialog } from './task-form-dialog';

describe('AddTaskDialog', () => {
  let component: TaskFormDialog;
  let fixture: ComponentFixture<TaskFormDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskFormDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskFormDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
