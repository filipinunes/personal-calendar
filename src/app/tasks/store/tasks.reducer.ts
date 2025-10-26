import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { Task } from '../data/models/task.model';
import * as TasksActions from './tasks.actions';

export interface TaskState extends EntityState<Task> {
  loading: boolean;
  error: any;
  outdated: boolean;
}

export const tasksAdapter = createEntityAdapter<Task>();

export const initialState: TaskState = tasksAdapter.getInitialState({
  loading: false,
  error: null,
  outdated: false,
});

export const tasksReducer = createReducer(
  initialState,
  on(TasksActions.loadTasks, (state) => ({
    ...state,
    loading: true,
  })),
  on(TasksActions.loadTasksSuccess, (state, { tasks }) =>
    tasksAdapter.setAll(tasks, { ...state, loading: false, outdated: false })
  ),
  on(TasksActions.loadTasksFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  on(TasksActions.createTask, (state) => ({
    ...state,
    loading: true,
  })),
  on(TasksActions.createTaskSuccess, (state) => ({ ...state, loading: false, outdated: true })),
  on(TasksActions.createTaskFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  on(TasksActions.editTask, (state) => ({
    ...state,
    loading: true,
  })),
  on(TasksActions.editTaskSuccess, (state) => ({ ...state, loading: false, outdated: true })),
  on(TasksActions.editTaskFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  on(TasksActions.deleteTask, (state) => ({
    ...state,
    loading: true,
  })),
  on(TasksActions.deleteTaskSuccess, (state) => ({ ...state, loading: false, outdated: true })),
  on(TasksActions.deleteTaskFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  }))
);
