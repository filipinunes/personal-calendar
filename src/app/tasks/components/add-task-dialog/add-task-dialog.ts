import { Component, inject, signal, WritableSignal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';

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
  form: FormGroup;
  readonly dialogRef = inject(MatDialogRef<AddTaskDialog>);

  constructor() {
    this.form = new FormGroup({
      title: new FormControl('', Validators.required),
      date: new FormControl('', Validators.required),
      status: new FormControl('', Validators.required),
      description: new FormControl(''),
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  get titleControl(): FormControl {
    return this.form.controls?.['title'] as FormControl;
  }

  get dateControl(): FormControl {
    return this.form.controls?.['date'] as FormControl;
  }

  get statusControl(): FormControl {
    return this.form.controls?.['status'] as FormControl;
  }

  get descriptionControl(): FormControl {
    return this.form.controls?.['description'] as FormControl;
  }
}
