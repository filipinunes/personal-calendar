import { importProvidersFrom } from '@angular/core';
import { Routes } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { TasksEffects } from './tasks/store/tasks.effects';
import { tasksReducer } from './tasks/store/tasks.reducer';
import { Tasks } from './tasks/tasks';

export const routes: Routes = [
  {
    path: '',
    component: Tasks,
    providers: [
      importProvidersFrom(
        StoreModule.forFeature('tasks', tasksReducer),
        EffectsModule.forFeature([TasksEffects])
      ),
    ],
  },
];
