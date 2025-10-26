import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { TasksService } from '../data/services/tasks.service';
import * as TasksActions from './tasks.actions';

@Injectable()
export class TasksEffects {
  private readonly actions$ = inject(Actions);
  private readonly tasksService = inject(TasksService);

  loadTasks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.loadTasks),
      mergeMap(({ filters }) =>
        this.tasksService.getTasks(filters).pipe(
          map((tasks) => TasksActions.loadTasksSuccess({ tasks })),
          catchError((error) => of(TasksActions.loadTasksFailure({ error })))
        )
      )
    )
  );

  createTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.createTask),
      mergeMap(({ task }) =>
        this.tasksService.createTask(task).pipe(
          map((task) => TasksActions.createTaskSuccess({ task })),
          catchError((error) => of(TasksActions.createTaskFailure({ error })))
        )
      )
    )
  );

  editTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.editTask),
      mergeMap(({ task }) =>
        this.tasksService.updateTask(task.id, task).pipe(
          map(() => TasksActions.editTaskSuccess()),
          catchError((error) => of(TasksActions.editTaskFailure({ error })))
        )
      )
    )
  );

  deleteTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.deleteTask),
      mergeMap(({ taskId }) =>
        this.tasksService.deleteTask(taskId).pipe(
          map(() => TasksActions.deleteTaskSuccess()),
          catchError((error) => of(TasksActions.deleteTaskFailure({ error })))
        )
      )
    )
  );
}
