import { createAction, props } from '@ngrx/store';
import { Task } from '../data/models/task.model';
import { TasksApiFilters } from '../data/services/tasks-api.interface';

export const loadTasks = createAction('[tasks] Load Tasks', props<{ filters?: TasksApiFilters }>());
export const loadTasksSuccess = createAction(
  '[tasks] Load Tasks Success',
  props<{ tasks: Task[] }>()
);
export const loadTasksFailure = createAction('[tasks] Load Tasks Failure', props<{ error: any }>());

export const createTask = createAction('[tasks] Create Task', props<{ task: Omit<Task, 'id'> }>());
export const createTaskSuccess = createAction(
  '[tasks] Create Task Success',
  props<{ task: Task }>()
);
export const createTaskFailure = createAction(
  '[tasks] Create Task Failure',
  props<{ error: any }>()
);

export const deleteTask = createAction('[tasks] Delete Task', props<{ taskId: string }>());
export const deleteTaskSuccess = createAction('[tasks] Delete Task Success');
export const deleteTaskFailure = createAction(
  '[tasks] Delete Task Failure',
  props<{ error: any }>()
);

export const editTask = createAction('[tasks] Edit Task', props<{ task: Task }>());
export const editTaskSuccess = createAction('[tasks] Edit Task Success');
export const editTaskFailure = createAction('[tasks] Edit Task Failure', props<{ error: any }>());
