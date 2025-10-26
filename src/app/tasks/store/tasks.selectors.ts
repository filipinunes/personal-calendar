import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TaskState, tasksAdapter } from './tasks.reducer';

export const selectTasksState = createFeatureSelector<TaskState>('tasks');

export const {
  selectAll: selectAllTasks,
  selectEntities: selectTaskEntities,
  selectIds: selectTaskIds,
} = tasksAdapter.getSelectors(selectTasksState);

export const selectLoading = createSelector(selectTasksState, (state) => state.loading);

export const selectError = createSelector(selectTasksState, (state) => state.error);

export const selectOutdated = createSelector(selectTasksState, (state) => state.outdated);
