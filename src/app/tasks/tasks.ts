import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatPaginator } from '@angular/material/paginator';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {
  BehaviorSubject,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  filter,
  finalize,
  first,
  map,
  Observable,
  startWith,
  switchMap,
} from 'rxjs';
import { StatusPipe } from '../shared/pipes/status-pipe';
import { TaskFormDialog } from './components/task-form-dialog/task-form-dialog';
import { Task, TaskStatus } from './data/models/task.model';
import { TasksService } from './data/services/tasks.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.html',
  styleUrl: './tasks.css',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInput,
    MatFormField,
    MatLabel,
    MatIcon,
    MatProgressSpinner,
    MatTableModule,
    MatPaginator,
    StatusPipe,
    MatButton,
    MatSelectModule,
    MatDatepickerModule,
  ],
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Tasks {
  readonly displayedColumns: string[] = ['title', 'status', 'date', 'description', 'actions'];
  readonly statuses: { label: string; value: TaskStatus }[] = [
    { label: 'Pendente', value: 'PENDING' },
    { label: 'Em andamento', value: 'IN_PROGRESS' },
    { label: 'Concluída', value: 'DONE' },
  ];
  readonly tasksService = inject(TasksService);
  readonly dialog = inject(MatDialog);

  isLoading = signal(false);
  hasError = signal(false);
  dataSource = signal(new MatTableDataSource<Task>([]));

  form = new FormGroup({
    search: new FormControl(''),
    statuses: new FormControl<string[]>([]),
    dateRange: new FormGroup({
      start: new FormControl(''),
      end: new FormControl(''),
    }),
  });

  tasks$: Observable<Task[]>;
  tasksChanged$ = new BehaviorSubject<void>(undefined);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor() {}

  ngOnInit() {
    this.setTasksListener();
    this.setTableDataSourceListener();
  }

  ngAfterViewInit() {
    this.dataSource().paginator = this.paginator;
  }

  openAddTaskDialog(): void {
    const dialogRef = this.dialog.open(TaskFormDialog);

    dialogRef.afterClosed().subscribe((payload) => {
      if (payload) {
        this.addTask(payload);
      }
    });
  }

  deleteTask(taskId: string): void {
    this.isLoading.update(() => true);

    this.tasksService
      .deleteTask(taskId)
      .pipe(finalize(() => this.isLoading.update(() => false)))
      .subscribe({
        next: () => {
          this.tasksChanged$.next();
        },
        error: () => this.hasError.update(() => true),
      });
  }

  opeEditTaskDialog(task: Task): void {
    const dialogRef = this.dialog.open(TaskFormDialog, { data: task });

    dialogRef.afterClosed().subscribe((payload) => {
      if (payload) {
        this.editTask({ ...payload, id: task.id });
      }
    });
  }

  private setTasksListener() {
    const searchChanges$ = this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      startWith(this.searchControl.value)
    );

    const statusesChanges$ = this.statusesControl.valueChanges.pipe(
      debounceTime(300),
      startWith(this.statusesControl.value)
    );

    const dateRangeChanges$ = this.endDateControl.valueChanges.pipe(
      filter((value) => !!value),
      map(() => this.dateRangeControl.value),
      startWith(this.dateRangeControl.value)
    );

    this.tasks$ = combineLatest([
      searchChanges$,
      statusesChanges$,
      dateRangeChanges$,
      this.tasksChanged$.asObservable(),
    ]).pipe(
      switchMap(([search, statuses, dateRange]) => {
        this.isLoading.update(() => true);

        return this.tasksService
          .getTasks({ search, statuses, dateRange })
          .pipe(finalize(() => this.isLoading.update(() => false)));
      })
    );
  }

  private setTableDataSourceListener(): void {
    this.tasks$.subscribe({
      next: (tasks) => {
        this.dataSource.update((dataSource) => {
          dataSource.data = tasks;

          return dataSource;
        });
      },
      error: () => {
        this.hasError.update(() => true);
      },
    });
  }

  private addTask(payload: Omit<Task, 'id'>) {
    this.tasksService
      .createTask(payload)
      .pipe(first())
      .subscribe({
        next: () => {
          this.tasksChanged$.next();
        },
        error: () => this.hasError.update(() => true),
      });
  }

  private editTask(payload: Task): void {
    this.tasksService
      .updateTask(payload.id, payload)
      .pipe(first())
      .subscribe({
        next: () => {
          this.tasksChanged$.next();
        },
        error: (err) => {
          console.log(err);
          this.hasError.update(() => true);
        },
      });
  }

  get searchControl() {
    return this.form.controls.search;
  }

  get statusesControl() {
    return this.form.controls.statuses;
  }

  get dateRangeControl() {
    return this.form.controls.dateRange;
  }

  get startDateControl() {
    return this.form.controls.dateRange.controls.start;
  }

  get endDateControl() {
    return this.form.controls.dateRange.controls.end;
  }
}
