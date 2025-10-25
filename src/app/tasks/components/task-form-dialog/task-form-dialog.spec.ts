import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { TaskFormDialog } from './task-form-dialog';
import { Task } from '../../data/models/task.model';

describe('TaskFormDialog', () => {
  let component: TaskFormDialog;
  let fixture: ComponentFixture<TaskFormDialog>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<TaskFormDialog>>;

  const mockTask: Task = {
    id: '1',
    title: 'Test Task',
    date: '2024-01-15',
    status: 'PENDING',
    description: 'Test description',
  };

  beforeEach(async () => {
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [
        TaskFormDialog,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatDatepickerModule,
        MatButtonModule,
      ],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: null },
        provideNativeDateAdapter(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskFormDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Initialization', () => {
    it('should initialize form with empty values when no data is provided', () => {
      expect(component.form.value).toEqual({
        title: '',
        date: '',
        status: '',
        description: '',
      });
    });

    it('should initialize form with required validators', () => {
      expect(component.titleControl.hasError('required')).toBe(true);
      expect(component.dateControl.hasError('required')).toBe(true);
      expect(component.statusControl.hasError('required')).toBe(true);
    });

    it('should not have required validator on description field', () => {
      component.descriptionControl.setValue('');
      expect(component.descriptionControl.hasError('required')).toBe(false);
    });

    it('should mark form as invalid when required fields are empty', () => {
      expect(component.form.valid).toBe(false);
    });

    it('should mark form as valid when all required fields are filled', () => {
      component.titleControl.setValue('Test');
      component.dateControl.setValue('2024-01-15');
      component.statusControl.setValue('PENDING');

      expect(component.form.valid).toBe(true);
    });
  });

  describe('Form with existing data', () => {
    beforeEach(async () => {
      await TestBed.resetTestingModule();

      await TestBed.configureTestingModule({
        imports: [
          TaskFormDialog,
          ReactiveFormsModule,
          MatFormFieldModule,
          MatInputModule,
          MatSelectModule,
          MatDatepickerModule,
          MatButtonModule,
        ],
        providers: [
          { provide: MatDialogRef, useValue: mockDialogRef },
          { provide: MAT_DIALOG_DATA, useValue: mockTask },
          provideNativeDateAdapter(),
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(TaskFormDialog);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should populate form with existing task data', () => {
      expect(component.titleControl.value).toBe('Test Task');
      expect(component.dateControl.value).toBe('2024-01-15');
      expect(component.statusControl.value).toBe('PENDING');
      expect(component.descriptionControl.value).toBe('Test description');
    });

    it('should mark form as valid when populated with valid data', () => {
      expect(component.form.valid).toBe(true);
    });
  });

  describe('Form with data without description', () => {
    beforeEach(async () => {
      const taskWithoutDescription: Task = {
        id: '2',
        title: 'Task without description',
        date: '2024-01-20',
        status: 'IN_PROGRESS',
      };

      await TestBed.resetTestingModule();

      await TestBed.configureTestingModule({
        imports: [
          TaskFormDialog,
          ReactiveFormsModule,
          MatFormFieldModule,
          MatInputModule,
          MatSelectModule,
          MatDatepickerModule,
          MatButtonModule,
        ],
        providers: [
          { provide: MatDialogRef, useValue: mockDialogRef },
          { provide: MAT_DIALOG_DATA, useValue: taskWithoutDescription },
          provideNativeDateAdapter(),
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(TaskFormDialog);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should populate form without description field', () => {
      expect(component.titleControl.value).toBe('Task without description');
      expect(component.dateControl.value).toBe('2024-01-20');
      expect(component.statusControl.value).toBe('IN_PROGRESS');
      expect(component.descriptionControl.value).toBe('');
    });
  });

  describe('Form Controls Getters', () => {
    it('should return title control', () => {
      expect(component.titleControl).toBe(component.form.controls.title);
    });

    it('should return date control', () => {
      expect(component.dateControl).toBe(component.form.controls.date);
    });

    it('should return status control', () => {
      expect(component.statusControl).toBe(component.form.controls.status);
    });

    it('should return description control', () => {
      expect(component.descriptionControl).toBe(component.form.controls.description);
    });
  });

  describe('Dialog Actions', () => {
    it('should close dialog when onNoClick is called', () => {
      component.onNoClick();
      expect(mockDialogRef.close).toHaveBeenCalled();
    });

    it('should close dialog without data when onNoClick is called', () => {
      component.onNoClick();
      expect(mockDialogRef.close).toHaveBeenCalledWith();
    });
  });

  describe('Form Validation', () => {
    it('should show title as invalid when empty', () => {
      component.titleControl.setValue('');
      component.titleControl.markAsTouched();

      expect(component.titleControl.invalid).toBe(true);
      expect(component.titleControl.errors?.['required']).toBe(true);
    });

    it('should show title as valid when filled', () => {
      component.titleControl.setValue('Valid Title');

      expect(component.titleControl.valid).toBe(true);
    });

    it('should show date as invalid when empty', () => {
      component.dateControl.setValue('');
      component.dateControl.markAsTouched();

      expect(component.dateControl.invalid).toBe(true);
      expect(component.dateControl.errors?.['required']).toBe(true);
    });

    it('should show status as invalid when empty', () => {
      component.statusControl.setValue('');
      component.statusControl.markAsTouched();

      expect(component.statusControl.invalid).toBe(true);
      expect(component.statusControl.errors?.['required']).toBe(true);
    });

    it('should allow description to be empty', () => {
      component.descriptionControl.setValue('');

      expect(component.descriptionControl.valid).toBe(true);
    });

    it('should validate entire form', () => {
      component.titleControl.setValue('');
      component.dateControl.setValue('');
      component.statusControl.setValue('');

      expect(component.form.invalid).toBe(true);

      component.titleControl.setValue('Task');
      component.dateControl.setValue('2024-01-15');
      component.statusControl.setValue('PENDING');

      expect(component.form.valid).toBe(true);
    });
  });

  describe('Form Value Changes', () => {
    it('should update form value when controls change', () => {
      component.titleControl.setValue('New Task');
      component.dateControl.setValue('2024-02-01');
      component.statusControl.setValue('DONE');
      component.descriptionControl.setValue('New description');

      expect(component.form.value).toEqual({
        title: 'New Task',
        date: '2024-02-01',
        status: 'DONE',
        description: 'New description',
      });
    });

    it('should handle partial form updates', () => {
      component.titleControl.setValue('Partial Update');

      expect(component.form.value.title).toBe('Partial Update');
      expect(component.form.value.date).toBe('');
    });
  });
});
