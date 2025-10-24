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
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-add-task-dialog',
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
  templateUrl: './add-task-dialog.html',
  styleUrl: './add-task-dialog.css',
})
export class AddTaskDialog {
  readonly dialogRef = inject(MatDialogRef<AddTaskDialog>);

  form = new FormGroup({
    title: new FormControl('', Validators.required),
    date: new FormControl('', Validators.required),
    status: new FormControl('', Validators.required),
    description: new FormControl(''),
  });

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
