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
import { Store } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { Tasks } from './tasks';
import { Task } from './data/models/task.model';
import { TaskFormDialog } from './components/task-form-dialog/task-form-dialog';
import { StatusPipe } from '../shared/pipes/status-pipe';
import * as TasksActions from './store/tasks.actions';
import * as TasksSelectors from './store/tasks.selectors';

describe('Tasks Component (with NgRx)', () => {
  let component: Tasks;
  let fixture: ComponentFixture<Tasks>;
  let store: MockStore;
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

  const initialState = {
    tasks: {
      ids: ['1', '2', '3'],
      entities: {
        '1': mockTasks[0],
        '2': mockTasks[1],
        '3': mockTasks[2],
      },
      loading: false,
      error: null,
      outdated: false,
    },
  };

  beforeEach(async () => {
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

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
        provideMockStore({ initialState }),
        { provide: MatDialog, useValue: dialogSpy },
        provideNativeDateAdapter(),
      ],
    }).compileComponents();

    store = TestBed.inject(Store) as MockStore;
    dialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;

    spyOn(store, 'dispatch');

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

    it('should initialize form with empty values', () => {
      expect(component.form.value).toEqual({
        search: '',
        statuses: [],
        dateRange: {
          start: null,
          end: null,
        },
      });
    });

    it('should initialize date controls as null', () => {
      expect(component.startDateControl.value).toBeNull();
      expect(component.endDateControl.value).toBeNull();
    });
  });

  describe('ngOnInit', () => {
    it('should dispatch loadTasks action on initialization', () => {
      fixture.detectChanges();

      expect(store.dispatch).toHaveBeenCalledWith(TasksActions.loadTasks({}));
    });

    it('should subscribe to tasks$ selector', fakeAsync(() => {
      store.overrideSelector(TasksSelectors.selectAllTasks, mockTasks);

      fixture.detectChanges();
      tick();

      expect(component.dataSource().data).toEqual(mockTasks);
    }));

    it('should subscribe to isLoading$ selector', (done) => {
      store.overrideSelector(TasksSelectors.selectLoading, true);

      fixture.detectChanges();

      component.isLoading$.subscribe((loading) => {
        expect(loading).toBe(true);
        done();
      });
    });

    it('should subscribe to hasError$ selector', (done) => {
      store.overrideSelector(TasksSelectors.selectError, 'Some error');

      fixture.detectChanges();

      component.hasError$.subscribe((error) => {
        expect(error).toBe('Some error');
        done();
      });
    });

    it('should subscribe to isOutdated$ selector', (done) => {
      store.overrideSelector(TasksSelectors.selectOutdated, true);

      fixture.detectChanges();

      component.isOutdated$.subscribe((outdated) => {
        expect(outdated).toBe(true);
        done();
      });
    });
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
    it('should dispatch loadTasks with search filter after debounce', fakeAsync(() => {
      store.overrideSelector(TasksSelectors.selectOutdated, false);
      fixture.detectChanges();
      (store.dispatch as jasmine.Spy).calls.reset();

      component.searchControl.setValue('Task 1');
      tick(300);

      expect(store.dispatch).toHaveBeenCalledWith(
        TasksActions.loadTasks({
          filters: {
            search: 'Task 1',
            statuses: [],
            dateRange: { start: null, end: null },
          },
        })
      );
    }));

    it('should debounce search input changes', fakeAsync(() => {
      store.overrideSelector(TasksSelectors.selectOutdated, false);
      fixture.detectChanges();
      (store.dispatch as jasmine.Spy).calls.reset();

      component.searchControl.setValue('T');
      tick(100);
      component.searchControl.setValue('Ta');
      tick(100);
      component.searchControl.setValue('Tas');
      tick(300);

      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith(
        TasksActions.loadTasks({
          filters: {
            search: 'Tas',
            statuses: [],
            dateRange: { start: null, end: null },
          },
        })
      );
    }));

    it('should not dispatch for duplicate search values', fakeAsync(() => {
      store.overrideSelector(TasksSelectors.selectOutdated, false);
      fixture.detectChanges();
      (store.dispatch as jasmine.Spy).calls.reset();

      component.searchControl.setValue('Task');
      tick(300);
      const firstCallCount = (store.dispatch as jasmine.Spy).calls.count();

      component.searchControl.setValue('Task');
      tick(300);

      expect((store.dispatch as jasmine.Spy).calls.count()).toBe(firstCallCount);
    }));
  });

  describe('Status Filtering', () => {
    it('should dispatch loadTasks with selected statuses', fakeAsync(() => {
      store.overrideSelector(TasksSelectors.selectOutdated, false);
      fixture.detectChanges();
      (store.dispatch as jasmine.Spy).calls.reset();

      component.statusesControl.setValue(['PENDING', 'DONE']);
      tick(300);

      expect(store.dispatch).toHaveBeenCalledWith(
        TasksActions.loadTasks({
          filters: {
            search: '',
            statuses: ['PENDING', 'DONE'],
            dateRange: { start: null, end: null },
          },
        })
      );
    }));

    it('should debounce status changes', fakeAsync(() => {
      store.overrideSelector(TasksSelectors.selectOutdated, false);
      fixture.detectChanges();
      (store.dispatch as jasmine.Spy).calls.reset();

      component.statusesControl.setValue(['PENDING']);
      tick(100);
      component.statusesControl.setValue(['PENDING', 'DONE']);
      tick(300);

      expect(store.dispatch).toHaveBeenCalledTimes(1);
    }));
  });

  describe('Date Range Filtering', () => {
    it('should dispatch loadTasks when both dates are set', fakeAsync(() => {
      store.overrideSelector(TasksSelectors.selectOutdated, false);
      fixture.detectChanges();
      (store.dispatch as jasmine.Spy).calls.reset();

      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-31');

      component.startDateControl.setValue(startDate);
      component.endDateControl.setValue(endDate);
      tick(300);

      const dispatchedAction = (store.dispatch as jasmine.Spy).calls.mostRecent().args[0];
      expect(dispatchedAction.type).toBe(TasksActions.loadTasks.type);
      expect(dispatchedAction.filters.search).toBe('');
      expect(dispatchedAction.filters.statuses).toEqual([]);
      expect(dispatchedAction.filters.dateRange.start).toEqual(startDate);
      expect(dispatchedAction.filters.dateRange.end).toEqual(endDate);
    }));

    it('should dispatch when both dates are cleared', fakeAsync(() => {
      store.overrideSelector(TasksSelectors.selectOutdated, false);
      fixture.detectChanges();

      // Set dates first
      component.startDateControl.setValue(new Date('2024-01-01'));
      component.endDateControl.setValue(new Date('2024-01-31'));
      tick(300);
      (store.dispatch as jasmine.Spy).calls.reset();

      // Clear both dates
      component.startDateControl.setValue(null);
      component.endDateControl.setValue(null);
      tick(300);

      expect(store.dispatch).toHaveBeenCalled();
    }));

    it('should not dispatch if only start date is set', fakeAsync(() => {
      store.overrideSelector(TasksSelectors.selectOutdated, false);
      fixture.detectChanges();
      (store.dispatch as jasmine.Spy).calls.reset();

      component.startDateControl.setValue(new Date('2024-01-01'));
      tick(300);

      expect(store.dispatch).not.toHaveBeenCalled();
    }));

    it('should not dispatch if only end date is set', fakeAsync(() => {
      store.overrideSelector(TasksSelectors.selectOutdated, false);
      fixture.detectChanges();
      (store.dispatch as jasmine.Spy).calls.reset();

      component.endDateControl.setValue(new Date('2024-01-31'));
      tick(300);

      expect(store.dispatch).not.toHaveBeenCalled();
    }));
  });

  describe('clearDateRange', () => {
    it('should clear both start and end dates', () => {
      component.startDateControl.setValue(new Date('2024-01-01'));
      component.endDateControl.setValue(new Date('2024-01-31'));

      component.clearDateRange();

      expect(component.startDateControl.value).toBeNull();
      expect(component.endDateControl.value).toBeNull();
    });

    it('should work when dates are already null', () => {
      component.clearDateRange();

      expect(component.startDateControl.value).toBeNull();
      expect(component.endDateControl.value).toBeNull();
    });
  });

  describe('Combined Filters', () => {
    it('should apply all filters simultaneously', fakeAsync(() => {
      store.overrideSelector(TasksSelectors.selectOutdated, false);
      fixture.detectChanges();
      (store.dispatch as jasmine.Spy).calls.reset();

      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-31');

      component.searchControl.setValue('Task');
      component.statusesControl.setValue(['PENDING']);
      component.startDateControl.setValue(startDate);
      component.endDateControl.setValue(endDate);
      tick(300);

      const dispatchedAction = (store.dispatch as jasmine.Spy).calls.mostRecent().args[0];
      expect(dispatchedAction.type).toBe(TasksActions.loadTasks.type);
      expect(dispatchedAction.filters.search).toBe('Task');
      expect(dispatchedAction.filters.statuses).toEqual(['PENDING']);
      expect(dispatchedAction.filters.dateRange.start).toEqual(startDate);
      expect(dispatchedAction.filters.dateRange.end).toEqual(endDate);
    }));
  });

  describe('Outdated State Trigger', () => {
    it('should reload tasks when isOutdated$ changes to true', fakeAsync(() => {
      const outdatedSelector = store.overrideSelector(TasksSelectors.selectOutdated, false);
      fixture.detectChanges();
      (store.dispatch as jasmine.Spy).calls.reset();

      outdatedSelector.setResult(true);
      store.refreshState();
      tick(300);

      expect(store.dispatch).toHaveBeenCalledWith(
        TasksActions.loadTasks({
          filters: {
            search: '',
            statuses: [],
            dateRange: { start: null, end: null },
          },
        })
      );
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

    it('should dispatch createTask action when dialog returns data', fakeAsync(() => {
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

      expect(store.dispatch).toHaveBeenCalledWith(TasksActions.createTask({ task: newTask }));
    }));

    it('should not dispatch when dialog is cancelled', fakeAsync(() => {
      const dialogRefSpy = jasmine.createSpyObj<MatDialogRef<TaskFormDialog>>('MatDialogRef', [
        'afterClosed',
      ]);
      dialogRefSpy.afterClosed.and.returnValue(of(null));
      dialog.open.and.returnValue(dialogRefSpy);

      (store.dispatch as jasmine.Spy).calls.reset();
      component.openAddTaskDialog();
      tick();

      expect(store.dispatch).not.toHaveBeenCalled();
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

    it('should dispatch editTask action with updated task', fakeAsync(() => {
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

      expect(store.dispatch).toHaveBeenCalledWith(
        TasksActions.editTask({
          task: { ...updates, id: task.id },
        })
      );
    }));

    it('should preserve task id when editing', fakeAsync(() => {
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

      const dispatchedAction = (store.dispatch as jasmine.Spy).calls.mostRecent().args[0];
      expect(dispatchedAction.task.id).toBe(task.id);
    }));

    it('should not dispatch when dialog is cancelled', fakeAsync(() => {
      const task = mockTasks[0];
      const dialogRefSpy = jasmine.createSpyObj<MatDialogRef<TaskFormDialog>>('MatDialogRef', [
        'afterClosed',
      ]);
      dialogRefSpy.afterClosed.and.returnValue(of(null));
      dialog.open.and.returnValue(dialogRefSpy);

      (store.dispatch as jasmine.Spy).calls.reset();
      component.opeEditTaskDialog(task);
      tick();

      expect(store.dispatch).not.toHaveBeenCalled();
    }));
  });

  describe('deleteTask', () => {
    it('should dispatch deleteTask action', () => {
      const taskId = '1';

      component.deleteTask(taskId);

      expect(store.dispatch).toHaveBeenCalledWith(TasksActions.deleteTask({ taskId }));
    });

    it('should dispatch with correct task id', () => {
      const taskId = '123-abc-456';

      component.deleteTask(taskId);

      const dispatchedAction = (store.dispatch as jasmine.Spy).calls.mostRecent().args[0];
      expect(dispatchedAction.taskId).toBe(taskId);
    });
  });

  describe('Store Selectors', () => {
    it('should populate dataSource from tasks$ selector', fakeAsync(() => {
      const customTasks = [mockTasks[0], mockTasks[1]];
      store.overrideSelector(TasksSelectors.selectAllTasks, customTasks);

      fixture.detectChanges();
      tick();

      expect(component.dataSource().data).toEqual(customTasks);
    }));

    it('should update dataSource when tasks change', fakeAsync(() => {
      const tasksSelector = store.overrideSelector(TasksSelectors.selectAllTasks, [mockTasks[0]]);
      fixture.detectChanges();
      tick();

      expect(component.dataSource().data.length).toBe(1);

      tasksSelector.setResult(mockTasks);
      store.refreshState();
      tick();

      expect(component.dataSource().data.length).toBe(3);
    }));
  });
});
