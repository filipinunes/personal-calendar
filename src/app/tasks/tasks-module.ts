import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Tasks } from './tasks';
import { RouterModule } from '@angular/router';
import { routes } from './tasks.routes';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ReactiveFormsModule } from '@angular/forms';
import { TasksService } from './data/tasks.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatSlideToggleModule,
    MatToolbarRow,
    MatToolbar,
    MatIcon,
    MatButtonModule,
    MatFormField,
    MatLabel,
    ReactiveFormsModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
  ],
  exports: [RouterModule],
  declarations: [Tasks],
  providers: [TasksService],
})
export class TasksModule {}
