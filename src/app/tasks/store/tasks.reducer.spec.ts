import { tasksReducer, initialState, TaskState, tasksAdapter } from './tasks.reducer';
import * as TasksActions from './tasks.actions';
import { Task } from '../data/models/task.model';

describe('TasksReducer', () => {
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

  describe('Initial State', () => {
    it('should return the initial state', () => {
      const action = { type: 'Unknown' };
      const state = tasksReducer(undefined, action);

      expect(state).toEqual(initialState);
    });

    it('should have initial state with empty entities', () => {
      expect(initialState.ids).toEqual([]);
      expect(initialState.entities).toEqual({});
    });

    it('should have loading set to false', () => {
      expect(initialState.loading).toBe(false);
    });

    it('should have error set to null', () => {
      expect(initialState.error).toBeNull();
    });

    it('should have outdated set to false', () => {
      expect(initialState.outdated).toBe(false);
    });
  });

  describe('loadTasks', () => {
    it('should set loading to true', () => {
      const action = TasksActions.loadTasks({});
      const state = tasksReducer(initialState, action);

      expect(state.loading).toBe(true);
    });

    it('should preserve existing tasks when loading', () => {
      const existingState: TaskState = {
        ...initialState,
        ids: ['1'],
        entities: { '1': mockTasks[0] },
      };

      const action = TasksActions.loadTasks({});
      const state = tasksReducer(existingState, action);

      expect(state.ids).toEqual(['1']);
      expect(state.entities['1']).toEqual(mockTasks[0]);
    });

    it('should preserve error state when loading', () => {
      const existingState: TaskState = {
        ...initialState,
        error: 'Previous error',
      };

      const action = TasksActions.loadTasks({});
      const state = tasksReducer(existingState, action);

      expect(state.error).toBe('Previous error');
    });
  });

  describe('loadTasksSuccess', () => {
    it('should set all tasks', () => {
      const action = TasksActions.loadTasksSuccess({ tasks: mockTasks });
      const state = tasksReducer(initialState, action);

      expect(state.ids).toEqual(['1', '2', '3']);
      expect(state.entities['1']).toEqual(mockTasks[0]);
      expect(state.entities['2']).toEqual(mockTasks[1]);
      expect(state.entities['3']).toEqual(mockTasks[2]);
    });

    it('should set loading to false', () => {
      const action = TasksActions.loadTasksSuccess({ tasks: mockTasks });
      const state = tasksReducer(initialState, action);

      expect(state.loading).toBe(false);
    });

    it('should set outdated to false', () => {
      const existingState: TaskState = {
        ...initialState,
        outdated: true,
      };

      const action = TasksActions.loadTasksSuccess({ tasks: mockTasks });
      const state = tasksReducer(existingState, action);

      expect(state.outdated).toBe(false);
    });

    it('should replace existing tasks', () => {
      const existingState: TaskState = {
        ...initialState,
        ids: ['999'],
        entities: {
          '999': { id: '999', title: 'Old Task', date: '2024-01-01', status: 'PENDING' },
        },
      };

      const action = TasksActions.loadTasksSuccess({ tasks: mockTasks });
      const state = tasksReducer(existingState, action);

      expect(state.ids).toEqual(['1', '2', '3']);
      expect(state.entities['999']).toBeUndefined();
    });

    it('should handle empty tasks array', () => {
      const action = TasksActions.loadTasksSuccess({ tasks: [] });
      const state = tasksReducer(initialState, action);

      expect(state.ids).toEqual([]);
      expect(state.entities).toEqual({});
      expect(state.loading).toBe(false);
    });
  });

  describe('loadTasksFailure', () => {
    it('should set error', () => {
      const error = new Error('Load failed');
      const action = TasksActions.loadTasksFailure({ error });
      const state = tasksReducer(initialState, action);

      expect(state.error).toEqual(error);
    });

    it('should set loading to false', () => {
      const loadingState: TaskState = {
        ...initialState,
        loading: true,
      };

      const error = new Error('Load failed');
      const action = TasksActions.loadTasksFailure({ error });
      const state = tasksReducer(loadingState, action);

      expect(state.loading).toBe(false);
    });

    it('should preserve existing tasks', () => {
      const existingState: TaskState = {
        ...initialState,
        ids: ['1'],
        entities: { '1': mockTasks[0] },
      };

      const error = new Error('Load failed');
      const action = TasksActions.loadTasksFailure({ error });
      const state = tasksReducer(existingState, action);

      expect(state.ids).toEqual(['1']);
      expect(state.entities['1']).toEqual(mockTasks[0]);
    });
  });

  describe('createTask', () => {
    it('should set loading to true', () => {
      const newTask = {
        title: 'New Task',
        date: '2024-02-01',
        status: 'PENDING' as const,
        description: 'New description',
      };

      const action = TasksActions.createTask({ task: newTask });
      const state = tasksReducer(initialState, action);

      expect(state.loading).toBe(true);
    });

    it('should not modify tasks when creating', () => {
      const newTask = {
        title: 'New Task',
        date: '2024-02-01',
        status: 'PENDING' as const,
      };

      const action = TasksActions.createTask({ task: newTask });
      const state = tasksReducer(initialState, action);

      expect(state.ids).toEqual([]);
      expect(state.entities).toEqual({});
    });
  });

  describe('createTaskSuccess', () => {
    it('should set loading to false', () => {
      const loadingState: TaskState = {
        ...initialState,
        loading: true,
      };

      const createdTask: Task = { ...mockTasks[0], id: '4' };
      const action = TasksActions.createTaskSuccess({ task: createdTask });
      const state = tasksReducer(loadingState, action);

      expect(state.loading).toBe(false);
    });

    it('should set outdated to true', () => {
      const createdTask: Task = { ...mockTasks[0], id: '4' };
      const action = TasksActions.createTaskSuccess({ task: createdTask });
      const state = tasksReducer(initialState, action);

      expect(state.outdated).toBe(true);
    });

    it('should preserve existing tasks', () => {
      const existingState: TaskState = {
        ...initialState,
        ids: ['1'],
        entities: { '1': mockTasks[0] },
      };

      const createdTask: Task = { ...mockTasks[1], id: '4' };
      const action = TasksActions.createTaskSuccess({ task: createdTask });
      const state = tasksReducer(existingState, action);

      expect(state.ids).toEqual(['1']);
      expect(state.entities['1']).toEqual(mockTasks[0]);
    });
  });

  describe('createTaskFailure', () => {
    it('should set error', () => {
      const error = new Error('Create failed');
      const action = TasksActions.createTaskFailure({ error });
      const state = tasksReducer(initialState, action);

      expect(state.error).toEqual(error);
    });

    it('should set loading to false', () => {
      const loadingState: TaskState = {
        ...initialState,
        loading: true,
      };

      const error = new Error('Create failed');
      const action = TasksActions.createTaskFailure({ error });
      const state = tasksReducer(loadingState, action);

      expect(state.loading).toBe(false);
    });
  });

  describe('editTask', () => {
    it('should set loading to true', () => {
      const taskToEdit: Task = mockTasks[0];
      const action = TasksActions.editTask({ task: taskToEdit });
      const state = tasksReducer(initialState, action);

      expect(state.loading).toBe(true);
    });

    it('should not modify tasks when editing', () => {
      const existingState: TaskState = {
        ...initialState,
        ids: ['1'],
        entities: { '1': mockTasks[0] },
      };

      const taskToEdit: Task = { ...mockTasks[0], title: 'Updated' };
      const action = TasksActions.editTask({ task: taskToEdit });
      const state = tasksReducer(existingState, action);

      expect(state.entities['1']!.title).toBe('Task 1');
    });
  });

  describe('editTaskSuccess', () => {
    it('should set loading to false', () => {
      const loadingState: TaskState = {
        ...initialState,
        loading: true,
      };

      const action = TasksActions.editTaskSuccess();
      const state = tasksReducer(loadingState, action);

      expect(state.loading).toBe(false);
    });

    it('should set outdated to true', () => {
      const action = TasksActions.editTaskSuccess();
      const state = tasksReducer(initialState, action);

      expect(state.outdated).toBe(true);
    });

    it('should preserve existing tasks', () => {
      const existingState: TaskState = {
        ...initialState,
        ids: ['1'],
        entities: { '1': mockTasks[0] },
      };

      const action = TasksActions.editTaskSuccess();
      const state = tasksReducer(existingState, action);

      expect(state.ids).toEqual(['1']);
      expect(state.entities['1']).toEqual(mockTasks[0]);
    });
  });

  describe('editTaskFailure', () => {
    it('should set error', () => {
      const error = new Error('Edit failed');
      const action = TasksActions.editTaskFailure({ error });
      const state = tasksReducer(initialState, action);

      expect(state.error).toEqual(error);
    });

    it('should set loading to false', () => {
      const loadingState: TaskState = {
        ...initialState,
        loading: true,
      };

      const error = new Error('Edit failed');
      const action = TasksActions.editTaskFailure({ error });
      const state = tasksReducer(loadingState, action);

      expect(state.loading).toBe(false);
    });
  });

  describe('deleteTask', () => {
    it('should set loading to true', () => {
      const action = TasksActions.deleteTask({ taskId: '1' });
      const state = tasksReducer(initialState, action);

      expect(state.loading).toBe(true);
    });

    it('should not remove task when deleting', () => {
      const existingState: TaskState = {
        ...initialState,
        ids: ['1'],
        entities: { '1': mockTasks[0] },
      };

      const action = TasksActions.deleteTask({ taskId: '1' });
      const state = tasksReducer(existingState, action);

      expect(state.entities['1']).toEqual(mockTasks[0]);
    });
  });

  describe('deleteTaskSuccess', () => {
    it('should set loading to false', () => {
      const loadingState: TaskState = {
        ...initialState,
        loading: true,
      };

      const action = TasksActions.deleteTaskSuccess();
      const state = tasksReducer(loadingState, action);

      expect(state.loading).toBe(false);
    });

    it('should set outdated to true', () => {
      const action = TasksActions.deleteTaskSuccess();
      const state = tasksReducer(initialState, action);

      expect(state.outdated).toBe(true);
    });

    it('should preserve existing tasks', () => {
      const existingState: TaskState = {
        ...initialState,
        ids: ['1', '2'],
        entities: { '1': mockTasks[0], '2': mockTasks[1] },
      };

      const action = TasksActions.deleteTaskSuccess();
      const state = tasksReducer(existingState, action);

      expect(state.ids).toEqual(['1', '2']);
      expect(state.entities['1']).toEqual(mockTasks[0]);
      expect(state.entities['2']).toEqual(mockTasks[1]);
    });
  });

  describe('deleteTaskFailure', () => {
    it('should set error', () => {
      const error = new Error('Delete failed');
      const action = TasksActions.deleteTaskFailure({ error });
      const state = tasksReducer(initialState, action);

      expect(state.error).toEqual(error);
    });

    it('should set loading to false', () => {
      const loadingState: TaskState = {
        ...initialState,
        loading: true,
      };

      const error = new Error('Delete failed');
      const action = TasksActions.deleteTaskFailure({ error });
      const state = tasksReducer(loadingState, action);

      expect(state.loading).toBe(false);
    });
  });

  describe('State Transitions', () => {
    it('should handle multiple actions in sequence', () => {
      let state = tasksReducer(initialState, TasksActions.loadTasks({}));
      expect(state.loading).toBe(true);

      state = tasksReducer(state, TasksActions.loadTasksSuccess({ tasks: mockTasks }));
      expect(state.loading).toBe(false);
      expect(state.ids.length).toBe(3);

      state = tasksReducer(
        state,
        TasksActions.createTask({ task: { title: 'New', date: '2024-02-01', status: 'PENDING' } })
      );
      expect(state.loading).toBe(true);

      state = tasksReducer(
        state,
        TasksActions.createTaskSuccess({
          task: { id: '4', title: 'New', date: '2024-02-01', status: 'PENDING' },
        })
      );
      expect(state.loading).toBe(false);
      expect(state.outdated).toBe(true);
    });

    it('should clear outdated flag on successful load', () => {
      const outdatedState: TaskState = {
        ...initialState,
        outdated: true,
      };

      const state = tasksReducer(
        outdatedState,
        TasksActions.loadTasksSuccess({ tasks: mockTasks })
      );
      expect(state.outdated).toBe(false);
    });

    it('should maintain outdated flag on load failure', () => {
      const outdatedState: TaskState = {
        ...initialState,
        outdated: true,
      };

      const state = tasksReducer(outdatedState, TasksActions.loadTasksFailure({ error: 'error' }));
      expect(state.outdated).toBe(true);
    });
  });
});
