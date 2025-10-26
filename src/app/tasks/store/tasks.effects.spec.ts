import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, throwError } from 'rxjs';
import { Task } from '../data/models/task.model';
import { TasksService } from '../data/services/tasks.service';
import * as TasksActions from './tasks.actions';
import { TasksEffects } from './tasks.effects';

describe('TasksEffects', () => {
  let effects: TasksEffects;
  let actions$: Observable<any>;
  let tasksService: jasmine.SpyObj<TasksService>;

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
  ];

  beforeEach(() => {
    const tasksServiceSpy = jasmine.createSpyObj('TasksService', [
      'getTasks',
      'createTask',
      'updateTask',
      'deleteTask',
    ]);

    TestBed.configureTestingModule({
      providers: [
        TasksEffects,
        provideMockActions(() => actions$),
        { provide: TasksService, useValue: tasksServiceSpy },
      ],
    });

    effects = TestBed.inject(TasksEffects);
    tasksService = TestBed.inject(TasksService) as jasmine.SpyObj<TasksService>;
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  describe('loadTasks$', () => {
    it('should dispatch loadTasksSuccess on successful load', (done) => {
      const filters = {
        search: 'test',
        statuses: ['PENDING'],
        dateRange: { start: null, end: null },
      };
      const action = TasksActions.loadTasks({ filters });
      const outcome = TasksActions.loadTasksSuccess({ tasks: mockTasks });

      tasksService.getTasks.and.returnValue(of(mockTasks));
      actions$ = of(action);

      effects.loadTasks$.subscribe((result) => {
        expect(result).toEqual(outcome);
        expect(tasksService.getTasks).toHaveBeenCalledWith(filters);
        done();
      });
    });

    it('should dispatch loadTasksSuccess with no filters', (done) => {
      const action = TasksActions.loadTasks({});
      const outcome = TasksActions.loadTasksSuccess({ tasks: mockTasks });

      tasksService.getTasks.and.returnValue(of(mockTasks));
      actions$ = of(action);

      effects.loadTasks$.subscribe((result) => {
        expect(result).toEqual(outcome);
        expect(tasksService.getTasks).toHaveBeenCalledWith(undefined);
        done();
      });
    });

    it('should dispatch loadTasksFailure on error', (done) => {
      const error = new Error('Load failed');
      const action = TasksActions.loadTasks({});
      const outcome = TasksActions.loadTasksFailure({ error });

      tasksService.getTasks.and.returnValue(throwError(() => error));
      actions$ = of(action);

      effects.loadTasks$.subscribe((result) => {
        expect(result).toEqual(outcome);
        done();
      });
    });

    it('should handle empty task list', (done) => {
      const action = TasksActions.loadTasks({});
      const outcome = TasksActions.loadTasksSuccess({ tasks: [] });

      tasksService.getTasks.and.returnValue(of([]));
      actions$ = of(action);

      effects.loadTasks$.subscribe((result) => {
        expect(result).toEqual(outcome);
        done();
      });
    });

    it('should pass filters correctly to service', (done) => {
      const filters = {
        search: 'Task',
        statuses: ['PENDING', 'DONE'],
        dateRange: { start: new Date('2024-01-01'), end: new Date('2024-01-31') },
      };
      const action = TasksActions.loadTasks({ filters });

      tasksService.getTasks.and.returnValue(of(mockTasks));
      actions$ = of(action);

      effects.loadTasks$.subscribe(() => {
        expect(tasksService.getTasks).toHaveBeenCalledWith(filters);
        done();
      });
    });
  });

  describe('createTask$', () => {
    it('should dispatch createTaskSuccess on successful creation', (done) => {
      const newTask: Omit<Task, 'id'> = {
        title: 'New Task',
        date: '2024-02-01',
        status: 'PENDING',
        description: 'New description',
      };
      const createdTask: Task = { ...newTask, id: '3' };
      const action = TasksActions.createTask({ task: newTask });
      const outcome = TasksActions.createTaskSuccess({ task: createdTask });

      tasksService.createTask.and.returnValue(of(createdTask));
      actions$ = of(action);

      effects.createTask$.subscribe((result) => {
        expect(result).toEqual(outcome);
        expect(tasksService.createTask).toHaveBeenCalledWith(newTask);
        done();
      });
    });

    it('should dispatch createTaskFailure on error', (done) => {
      const newTask: Omit<Task, 'id'> = {
        title: 'New Task',
        date: '2024-02-01',
        status: 'PENDING',
      };
      const error = new Error('Creation failed');
      const action = TasksActions.createTask({ task: newTask });
      const outcome = TasksActions.createTaskFailure({ error });

      tasksService.createTask.and.returnValue(throwError(() => error));
      actions$ = of(action);

      effects.createTask$.subscribe((result) => {
        expect(result).toEqual(outcome);
        done();
      });
    });

    it('should handle task without description', (done) => {
      const newTask: Omit<Task, 'id'> = {
        title: 'Task without desc',
        date: '2024-02-01',
        status: 'PENDING',
      };
      const createdTask: Task = { ...newTask, id: '4' };
      const action = TasksActions.createTask({ task: newTask });
      const outcome = TasksActions.createTaskSuccess({ task: createdTask });

      tasksService.createTask.and.returnValue(of(createdTask));
      actions$ = of(action);

      effects.createTask$.subscribe((result) => {
        expect(result).toEqual(outcome);
        done();
      });
    });
  });

  describe('editTask$', () => {
    it('should dispatch editTaskSuccess on successful update', (done) => {
      const taskToUpdate: Task = {
        id: '1',
        title: 'Updated Task',
        date: '2024-02-01',
        status: 'DONE',
        description: 'Updated',
      };
      const action = TasksActions.editTask({ task: taskToUpdate });
      const outcome = TasksActions.editTaskSuccess();

      tasksService.updateTask.and.returnValue(of(void 0));
      actions$ = of(action);

      effects.editTask$.subscribe((result) => {
        expect(result).toEqual(outcome);
        expect(tasksService.updateTask).toHaveBeenCalledWith('1', taskToUpdate);
        done();
      });
    });

    it('should dispatch editTaskFailure on error', (done) => {
      const taskToUpdate: Task = {
        id: '1',
        title: 'Updated Task',
        date: '2024-02-01',
        status: 'DONE',
      };
      const error = new Error('Update failed');
      const action = TasksActions.editTask({ task: taskToUpdate });
      const outcome = TasksActions.editTaskFailure({ error });

      tasksService.updateTask.and.returnValue(throwError(() => error));
      actions$ = of(action);

      effects.editTask$.subscribe((result) => {
        expect(result).toEqual(outcome);
        done();
      });
    });

    it('should pass task id and data to service', (done) => {
      const taskToUpdate: Task = {
        id: '123',
        title: 'Task to update',
        date: '2024-02-10',
        status: 'IN_PROGRESS',
      };
      const action = TasksActions.editTask({ task: taskToUpdate });

      tasksService.updateTask.and.returnValue(of(void 0));
      actions$ = of(action);

      effects.editTask$.subscribe(() => {
        expect(tasksService.updateTask).toHaveBeenCalledWith('123', taskToUpdate);
        done();
      });
    });
  });

  describe('deleteTask$', () => {
    it('should dispatch deleteTaskSuccess on successful deletion', (done) => {
      const taskId = '1';
      const action = TasksActions.deleteTask({ taskId });
      const outcome = TasksActions.deleteTaskSuccess();

      tasksService.deleteTask.and.returnValue(of(void 0));
      actions$ = of(action);

      effects.deleteTask$.subscribe((result) => {
        expect(result).toEqual(outcome);
        expect(tasksService.deleteTask).toHaveBeenCalledWith(taskId);
        done();
      });
    });

    it('should dispatch deleteTaskFailure on error', (done) => {
      const taskId = '1';
      const error = new Error('Deletion failed');
      const action = TasksActions.deleteTask({ taskId });
      const outcome = TasksActions.deleteTaskFailure({ error });

      tasksService.deleteTask.and.returnValue(throwError(() => error));
      actions$ = of(action);

      effects.deleteTask$.subscribe((result) => {
        expect(result).toEqual(outcome);
        done();
      });
    });

    it('should handle 404 errors gracefully', (done) => {
      const taskId = 'non-existent';
      const error = { status: 404, message: 'Not found' };
      const action = TasksActions.deleteTask({ taskId });
      const outcome = TasksActions.deleteTaskFailure({ error });

      tasksService.deleteTask.and.returnValue(throwError(() => error));
      actions$ = of(action);

      effects.deleteTask$.subscribe((result) => {
        expect(result).toEqual(outcome);
        done();
      });
    });
  });

  describe('Multiple Actions', () => {
    it('should handle multiple loadTasks actions', (done) => {
      tasksService.getTasks.and.returnValue(of(mockTasks));

      const action1 = TasksActions.loadTasks({});
      const action2 = TasksActions.loadTasks({ filters: { search: 'test' } });
      actions$ = of(action1, action2);

      const results: any[] = [];
      effects.loadTasks$.subscribe((result) => {
        results.push(result);
        if (results.length === 2) {
          expect(results[0].type).toBe(TasksActions.loadTasksSuccess.type);
          expect(results[1].type).toBe(TasksActions.loadTasksSuccess.type);
          expect(tasksService.getTasks).toHaveBeenCalledTimes(2);
          done();
        }
      });
    });

    it('should handle mixed success and failure', (done) => {
      const error = new Error('Failed');
      tasksService.getTasks.and.returnValues(
        of(mockTasks),
        throwError(() => error)
      );

      const action1 = TasksActions.loadTasks({});
      const action2 = TasksActions.loadTasks({});
      actions$ = of(action1, action2);

      const results: any[] = [];
      effects.loadTasks$.subscribe((result) => {
        results.push(result);
        if (results.length === 2) {
          expect(results[0].type).toBe(TasksActions.loadTasksSuccess.type);
          expect(results[1].type).toBe(TasksActions.loadTasksFailure.type);
          done();
        }
      });
    });
  });

  describe('Error Types', () => {
    it('should handle HTTP errors in loadTasks', (done) => {
      const httpError = { status: 500, message: 'Internal Server Error' };
      const action = TasksActions.loadTasks({});

      tasksService.getTasks.and.returnValue(throwError(() => httpError));
      actions$ = of(action);

      effects.loadTasks$.subscribe((result) => {
        expect(result.type).toBe(TasksActions.loadTasksFailure.type);
        if (result.type === TasksActions.loadTasksFailure.type) {
          expect(result.error).toEqual(httpError);
        }
        done();
      });
    });

    it('should handle network errors in createTask', (done) => {
      const newTask: Omit<Task, 'id'> = {
        title: 'Task',
        date: '2024-02-01',
        status: 'PENDING',
      };
      const networkError = { status: 0, message: 'Network error' };
      const action = TasksActions.createTask({ task: newTask });

      tasksService.createTask.and.returnValue(throwError(() => networkError));
      actions$ = of(action);

      effects.createTask$.subscribe((result) => {
        expect(result.type).toBe(TasksActions.createTaskFailure.type);
        if (result.type === TasksActions.createTaskFailure.type) {
          expect(result.error).toEqual(networkError);
        }
        done();
      });
    });
  });
});
