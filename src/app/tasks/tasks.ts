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
import { Store } from '@ngrx/store';
import { combineLatest, debounceTime, distinctUntilChanged, filter, map, startWith } from 'rxjs';
import { StatusPipe } from '../shared/pipes/status-pipe';
import { TaskFormDialog } from './components/task-form-dialog/task-form-dialog';
import { Task, TaskStatus } from './data/models/task.model';
import * as TasksActions from './store/tasks.actions';
import * as TasksSelectors from './store/tasks.selectors';

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
  readonly dialog = inject(MatDialog);
  readonly store = inject(Store);

  readonly displayedColumns: string[] = ['title', 'status', 'date', 'description', 'actions'];
  readonly statuses: { label: string; value: TaskStatus }[] = [
    { label: 'Pendente', value: 'PENDING' },
    { label: 'Em andamento', value: 'IN_PROGRESS' },
    { label: 'Concluída', value: 'DONE' },
  ];

  form = new FormGroup({
    search: new FormControl(''),
    statuses: new FormControl<string[]>([]),
    dateRange: new FormGroup({
      start: new FormControl(''),
      end: new FormControl(''),
    }),
  });

  tasks$ = this.store.select(TasksSelectors.selectAllTasks);
  isLoading$ = this.store.select(TasksSelectors.selectLoading);
  hasError$ = this.store.select(TasksSelectors.selectError);
  isOutdated$ = this.store.select(TasksSelectors.selectOutdated);
  dataSource = signal(new MatTableDataSource<Task>([]));

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor() {}

  ngOnInit() {
    this.store.dispatch(TasksActions.loadTasks({}));
    this.setTasksListener();
    this.setTableDataSourceListener();
  }

  ngAfterViewInit() {
    this.dataSource().paginator = this.paginator;
  }

  openAddTaskDialog(): void {
    const dialogRef = this.dialog.open(TaskFormDialog);

    dialogRef.afterClosed().subscribe((task) => {
      if (task) {
        this.store.dispatch(TasksActions.createTask({ task }));
      }
    });
  }

  deleteTask(taskId: string): void {
    this.store.dispatch(TasksActions.deleteTask({ taskId }));
  }

  opeEditTaskDialog(oldData: Task): void {
    const dialogRef = this.dialog.open(TaskFormDialog, { data: oldData });

    dialogRef.afterClosed().subscribe((task) => {
      if (task) {
        const updatedTask: Task = { ...task, id: oldData.id };
        this.store.dispatch(TasksActions.editTask({ task: updatedTask }));
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

    combineLatest([
      searchChanges$,
      statusesChanges$,
      dateRangeChanges$,
      this.isOutdated$,
    ]).subscribe(([search, statuses, dateRange]) => {
      this.store.dispatch(TasksActions.loadTasks({ filters: { search, statuses, dateRange } }));
    });
  }

  private setTableDataSourceListener(): void {
    this.tasks$.subscribe({
      next: (tasks) => {
        this.dataSource.update((dataSource) => {
          dataSource.data = tasks;

          return dataSource;
        });
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
