import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { of, throwError } from 'rxjs';
import { Tasks } from './tasks';
import { TasksService } from './data/services/tasks.service';
import { Task } from './data/models/task.model';
import { TaskFormDialog } from './components/task-form-dialog/task-form-dialog';
import { StatusPipe } from '../shared/pipes/status-pipe';

describe('Tasks Component', () => {
  let component: Tasks;
  let fixture: ComponentFixture<Tasks>;
  let tasksService: jasmine.SpyObj<TasksService>;
  let dialog: jasmine.SpyObj<MatDialog>;

  const mockTasks: Task[] = [
    {
      id: '1',
      title: 'Task 1',
      date: '2024-01-15',
      status: 'PENDING',
      description: 'Description 1',
    },
    {
      id: '2',
      title: 'Task 2',
      date: '2024-01-20',
      status: 'IN_PROGRESS',
      description: 'Description 2',
    },
    {
      id: '3',
      title: 'Task 3',
      date: '2024-01-25',
      status: 'DONE',
      description: 'Description 3',
    },
  ];

  beforeEach(async () => {
    const tasksServiceSpy = jasmine.createSpyObj('TasksService', [
      'getTasks',
      'createTask',
      'updateTask',
      'deleteTask',
    ]);
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    tasksServiceSpy.getTasks.and.returnValue(of(mockTasks));
    tasksServiceSpy.createTask.and.returnValue(of(mockTasks[0]));
    tasksServiceSpy.updateTask.and.returnValue(of(mockTasks[0]));
    tasksServiceSpy.deleteTask.and.returnValue(of(void 0));

    await TestBed.configureTestingModule({
      imports: [
        Tasks,
        ReactiveFormsModule,
        MatTableModule,
        MatPaginatorModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatDatepickerModule,
        StatusPipe,
      ],
      providers: [
        { provide: TasksService, useValue: tasksServiceSpy },
        { provide: MatDialog, useValue: dialogSpy },
        provideNativeDateAdapter(),
      ],
    }).compileComponents();

    tasksService = TestBed.inject(TasksService) as jasmine.SpyObj<TasksService>;
    dialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;

    fixture = TestBed.createComponent(Tasks);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Initialization', () => {
    it('should initialize with correct displayedColumns', () => {
      expect(component.displayedColumns).toEqual([
        'title',
        'status',
        'date',
        'description',
        'actions',
      ]);
    });

    it('should initialize with correct statuses', () => {
      expect(component.statuses).toEqual([
        { label: 'Pendente', value: 'PENDING' },
        { label: 'Em andamento', value: 'IN_PROGRESS' },
        { label: 'Concluída', value: 'DONE' },
      ]);
    });

    it('should initialize isLoading as false', () => {
      expect(component.isLoading()).toBe(false);
    });

    it('should initialize hasError as false', () => {
      expect(component.hasError()).toBe(false);
    });

    it('should initialize form with empty values', () => {
      expect(component.form.value).toEqual({
        search: '',
        statuses: [],
        dateRange: {
          start: '',
          end: '',
        },
      });
    });
  });

  describe('ngOnInit', () => {
    it('should call getTasks on initialization', fakeAsync(() => {
      fixture.detectChanges();
      tick(300);

      expect(tasksService.getTasks).toHaveBeenCalled();
    }));

    it('should load tasks into dataSource', fakeAsync(() => {
      fixture.detectChanges();
      tick(300);

      expect(component.dataSource().data).toEqual(mockTasks);
    }));

    it('should set isLoading to false after loading tasks', fakeAsync(() => {
      fixture.detectChanges();
      tick(300);

      expect(component.isLoading()).toBe(false);
    }));
  });

  describe('Form Controls', () => {
    it('should return search control', () => {
      expect(component.searchControl).toBe(component.form.controls.search);
    });

    it('should return statuses control', () => {
      expect(component.statusesControl).toBe(component.form.controls.statuses);
    });

    it('should return dateRange control', () => {
      expect(component.dateRangeControl).toBe(component.form.controls.dateRange);
    });

    it('should return startDate control', () => {
      expect(component.startDateControl).toBe(component.form.controls.dateRange.controls.start);
    });

    it('should return endDate control', () => {
      expect(component.endDateControl).toBe(component.form.controls.dateRange.controls.end);
    });
  });

  describe('Search Filtering', () => {
    it('should call getTasks with search term after debounce', fakeAsync(() => {
      fixture.detectChanges();
      tick(300);
      tasksService.getTasks.calls.reset();

      component.searchControl.setValue('Task 1');
      tick(300);

      expect(tasksService.getTasks).toHaveBeenCalledWith(
        jasmine.objectContaining({ search: 'Task 1' })
      );
    }));

    it('should debounce search input changes', fakeAsync(() => {
      fixture.detectChanges();
      tick(300);
      tasksService.getTasks.calls.reset();

      component.searchControl.setValue('T');
      tick(100);
      component.searchControl.setValue('Ta');
      tick(100);
      component.searchControl.setValue('Tas');
      tick(300);

      expect(tasksService.getTasks).toHaveBeenCalledTimes(1);
      expect(tasksService.getTasks).toHaveBeenCalledWith(
        jasmine.objectContaining({ search: 'Tas' })
      );
    }));

    it('should not call getTasks for duplicate search values', fakeAsync(() => {
      fixture.detectChanges();
      tick(300);
      tasksService.getTasks.calls.reset();

      component.searchControl.setValue('Task');
      tick(300);
      tasksService.getTasks.calls.reset();

      component.searchControl.setValue('Task');
      tick(300);

      expect(tasksService.getTasks).not.toHaveBeenCalled();
    }));
  });

  describe('Status Filtering', () => {
    it('should call getTasks with selected statuses', fakeAsync(() => {
      fixture.detectChanges();
      tick(300);
      tasksService.getTasks.calls.reset();

      component.statusesControl.setValue(['PENDING', 'DONE']);
      tick(300);

      expect(tasksService.getTasks).toHaveBeenCalledWith(
        jasmine.objectContaining({ statuses: ['PENDING', 'DONE'] })
      );
    }));

    it('should debounce status changes', fakeAsync(() => {
      fixture.detectChanges();
      tick(300);
      tasksService.getTasks.calls.reset();

      component.statusesControl.setValue(['PENDING']);
      tick(100);
      component.statusesControl.setValue(['PENDING', 'DONE']);
      tick(300);

      expect(tasksService.getTasks).toHaveBeenCalledTimes(1);
    }));
  });

  describe('Date Range Filtering', () => {
    it('should call getTasks when end date is set', fakeAsync(() => {
      fixture.detectChanges();
      tick(300);
      tasksService.getTasks.calls.reset();

      component.startDateControl.setValue('2024-01-01');
      component.endDateControl.setValue('2024-01-31');
      tick(300);

      expect(tasksService.getTasks).toHaveBeenCalledWith(
        jasmine.objectContaining({
          dateRange: { start: '2024-01-01', end: '2024-01-31' },
        })
      );
    }));

    it('should not trigger filter if end date is not set', fakeAsync(() => {
      fixture.detectChanges();
      tick(300);
      tasksService.getTasks.calls.reset();

      component.startDateControl.setValue('2024-01-01');
      tick(300);

      expect(tasksService.getTasks).not.toHaveBeenCalled();
    }));
  });

  describe('Combined Filters', () => {
    it('should apply all filters simultaneously', fakeAsync(() => {
      fixture.detectChanges();
      tick(300);
      tasksService.getTasks.calls.reset();

      component.searchControl.setValue('Task');
      component.statusesControl.setValue(['PENDING']);
      component.startDateControl.setValue('2024-01-01');
      component.endDateControl.setValue('2024-01-31');
      tick(300);

      expect(tasksService.getTasks).toHaveBeenCalledWith({
        search: 'Task',
        statuses: ['PENDING'],
        dateRange: { start: '2024-01-01', end: '2024-01-31' },
      });
    }));
  });

  describe('openAddTaskDialog', () => {
    it('should open dialog for adding a task', () => {
      const dialogRefSpy = jasmine.createSpyObj<MatDialogRef<TaskFormDialog>>('MatDialogRef', [
        'afterClosed',
      ]);
      dialogRefSpy.afterClosed.and.returnValue(of(null));
      dialog.open.and.returnValue(dialogRefSpy);

      component.openAddTaskDialog();

      expect(dialog.open).toHaveBeenCalledWith(TaskFormDialog);
    });

    it('should create task when dialog returns payload', fakeAsync(() => {
      const newTask = {
        title: 'New Task',
        date: '2024-02-01',
        status: 'PENDING' as const,
        description: 'New description',
      };

      const dialogRefSpy = jasmine.createSpyObj<MatDialogRef<TaskFormDialog>>('MatDialogRef', [
        'afterClosed',
      ]);
      dialogRefSpy.afterClosed.and.returnValue(of(newTask));
      dialog.open.and.returnValue(dialogRefSpy);

      component.openAddTaskDialog();
      tick();

      expect(tasksService.createTask).toHaveBeenCalledWith(newTask);
    }));

    it('should not create task when dialog is cancelled', fakeAsync(() => {
      const dialogRefSpy = jasmine.createSpyObj<MatDialogRef<TaskFormDialog>>('MatDialogRef', [
        'afterClosed',
      ]);
      dialogRefSpy.afterClosed.and.returnValue(of(null));
      dialog.open.and.returnValue(dialogRefSpy);

      tasksService.createTask.calls.reset();
      component.openAddTaskDialog();
      tick();

      expect(tasksService.createTask).not.toHaveBeenCalled();
    }));

    it('should refresh tasks after successful creation', fakeAsync(() => {
      const newTask = {
        title: 'New Task',
        date: '2024-02-01',
        status: 'PENDING' as const,
      };

      const dialogRefSpy = jasmine.createSpyObj<MatDialogRef<TaskFormDialog>>('MatDialogRef', [
        'afterClosed',
      ]);
      dialogRefSpy.afterClosed.and.returnValue(of(newTask));
      dialog.open.and.returnValue(dialogRefSpy);

      fixture.detectChanges();
      tick(300);
      tasksService.getTasks.calls.reset();

      component.openAddTaskDialog();
      tick();

      expect(tasksService.getTasks).toHaveBeenCalled();
    }));

    it('should set hasError to true on creation failure', fakeAsync(() => {
      const newTask = {
        title: 'New Task',
        date: '2024-02-01',
        status: 'PENDING' as const,
      };

      tasksService.createTask.and.returnValue(throwError(() => new Error('Creation failed')));

      const dialogRefSpy = jasmine.createSpyObj<MatDialogRef<TaskFormDialog>>('MatDialogRef', [
        'afterClosed',
      ]);
      dialogRefSpy.afterClosed.and.returnValue(of(newTask));
      dialog.open.and.returnValue(dialogRefSpy);

      component.openAddTaskDialog();
      tick();

      expect(component.hasError()).toBe(true);
    }));
  });

  describe('opeEditTaskDialog', () => {
    it('should open dialog with task data', () => {
      const task = mockTasks[0];
      const dialogRefSpy = jasmine.createSpyObj<MatDialogRef<TaskFormDialog>>('MatDialogRef', [
        'afterClosed',
      ]);
      dialogRefSpy.afterClosed.and.returnValue(of(null));
      dialog.open.and.returnValue(dialogRefSpy);

      component.opeEditTaskDialog(task);

      expect(dialog.open).toHaveBeenCalledWith(TaskFormDialog, { data: task });
    });

    it('should update task when dialog returns payload', fakeAsync(() => {
      const task = mockTasks[0];
      const updates = {
        title: 'Updated Task',
        date: '2024-02-01',
        status: 'DONE' as const,
      };

      const dialogRefSpy = jasmine.createSpyObj<MatDialogRef<TaskFormDialog>>('MatDialogRef', [
        'afterClosed',
      ]);
      dialogRefSpy.afterClosed.and.returnValue(of(updates));
      dialog.open.and.returnValue(dialogRefSpy);

      component.opeEditTaskDialog(task);
      tick();

      expect(tasksService.updateTask).toHaveBeenCalledWith(task.id, { ...updates, id: task.id });
    }));

    it('should not update task when dialog is cancelled', fakeAsync(() => {
      const task = mockTasks[0];
      const dialogRefSpy = jasmine.createSpyObj<MatDialogRef<TaskFormDialog>>('MatDialogRef', [
        'afterClosed',
      ]);
      dialogRefSpy.afterClosed.and.returnValue(of(null));
      dialog.open.and.returnValue(dialogRefSpy);

      tasksService.updateTask.calls.reset();
      component.opeEditTaskDialog(task);
      tick();

      expect(tasksService.updateTask).not.toHaveBeenCalled();
    }));

    it('should refresh tasks after successful update', fakeAsync(() => {
      const task = mockTasks[0];
      const updates = { title: 'Updated' };

      const dialogRefSpy = jasmine.createSpyObj<MatDialogRef<TaskFormDialog>>('MatDialogRef', [
        'afterClosed',
      ]);
      dialogRefSpy.afterClosed.and.returnValue(of(updates));
      dialog.open.and.returnValue(dialogRefSpy);

      fixture.detectChanges();
      tick(300);
      tasksService.getTasks.calls.reset();

      component.opeEditTaskDialog(task);
      tick();

      expect(tasksService.getTasks).toHaveBeenCalled();
    }));

    it('should set hasError to true on update failure', fakeAsync(() => {
      const task = mockTasks[0];
      const updates = { title: 'Updated' };

      spyOn(console, 'log');
      tasksService.updateTask.and.returnValue(throwError(() => new Error('Update failed')));

      const dialogRefSpy = jasmine.createSpyObj<MatDialogRef<TaskFormDialog>>('MatDialogRef', [
        'afterClosed',
      ]);
      dialogRefSpy.afterClosed.and.returnValue(of(updates));
      dialog.open.and.returnValue(dialogRefSpy);

      component.opeEditTaskDialog(task);
      tick();

      expect(component.hasError()).toBe(true);
      expect(console.log).toHaveBeenCalled();
    }));
  });

  describe('deleteTask', () => {
    it('should call deleteTask service method', fakeAsync(() => {
      const taskId = '1';

      component.deleteTask(taskId);
      tick();

      expect(tasksService.deleteTask).toHaveBeenCalledWith(taskId);
    }));

    it('should set isLoading to true while deleting', fakeAsync(() => {
      const taskId = '1';
      let loadingDuringCall = false;

      tasksService.deleteTask.and.callFake(() => {
        loadingDuringCall = component.isLoading();
        return of(void 0);
      });

      component.deleteTask(taskId);
      tick();

      expect(loadingDuringCall).toBe(true);
    }));

    it('should set isLoading to false after deletion', fakeAsync(() => {
      const taskId = '1';

      component.deleteTask(taskId);
      tick();

      expect(component.isLoading()).toBe(false);
    }));

    it('should refresh tasks after successful deletion', fakeAsync(() => {
      fixture.detectChanges();
      tick(300);
      tasksService.getTasks.calls.reset();

      component.deleteTask('1');
      tick();

      expect(tasksService.getTasks).toHaveBeenCalled();
    }));

    it('should set hasError to true on deletion failure', fakeAsync(() => {
      tasksService.deleteTask.and.returnValue(throwError(() => new Error('Delete failed')));

      component.deleteTask('1');
      tick();

      expect(component.hasError()).toBe(true);
    }));

    it('should set isLoading to false even on error', fakeAsync(() => {
      tasksService.deleteTask.and.returnValue(throwError(() => new Error('Delete failed')));

      component.deleteTask('1');
      tick();

      expect(component.isLoading()).toBe(false);
    }));
  });

  describe('Error Handling', () => {
    it('should set hasError to true when getTasks fails', fakeAsync(() => {
      tasksService.getTasks.and.returnValue(throwError(() => new Error('Load failed')));

      fixture.detectChanges();
      tick(300);

      expect(component.hasError()).toBe(true);
    }));

    it('should set isLoading to false when getTasks fails', fakeAsync(() => {
      tasksService.getTasks.and.returnValue(throwError(() => new Error('Load failed')));

      fixture.detectChanges();
      tick(300);

      expect(component.isLoading()).toBe(false);
    }));
  });
});
