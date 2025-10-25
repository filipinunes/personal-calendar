import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Task } from '../../data/models/task.model';

@Component({
  selector: 'app-task-form-dialog',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatSelectModule,
    ReactiveFormsModule,
    MatDatepickerModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './task-form-dialog.html',
  styleUrl: './task-form-dialog.css',
})
export class TaskFormDialog {
  readonly dialogRef = inject(MatDialogRef<TaskFormDialog>);
  readonly data = inject<Task>(MAT_DIALOG_DATA);

  form = new FormGroup({
    title: new FormControl('', Validators.required),
    date: new FormControl('', Validators.required),
    status: new FormControl('', Validators.required),
    description: new FormControl(''),
  });

  constructor() {
    if (this.data) {
      this.titleControl.patchValue(this.data.title);
      this.dateControl.patchValue(this.data.date);
      this.statusControl.patchValue(this.data.status);

      if (this.data.description) {
        this.descriptionControl.patchValue(this.data.description);
      }
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  get titleControl() {
    return this.form.controls.title;
  }

  get dateControl() {
    return this.form.controls.date;
  }

  get statusControl() {
    return this.form.controls.status;
  }

  get descriptionControl() {
    return this.form.controls.description;
  }
}
