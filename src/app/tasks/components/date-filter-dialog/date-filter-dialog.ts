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
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

interface DialogData {
  from: string;
  to: string;
}

@Component({
  selector: 'app-date-filter-dialog',
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
  templateUrl: './date-filter-dialog.html',
  styleUrl: './date-filter-dialog.css',
})
export class DateFilterDialog {
  readonly dialogRef = inject(MatDialogRef<DateFilterDialog>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);

  form = new FormGroup({
    from: new FormControl('', Validators.required),
    to: new FormControl('', Validators.required),
  });

  constructor() {
    if (this.data) {
      this.fromControl.patchValue(new Date(this.data.from));
      this.toControl.patchValue(new Date(this.data.to));
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  get fromControl(): FormControl {
    return this.form.controls.from;
  }

  get toControl(): FormControl {
    return this.form.controls.to;
  }
}
