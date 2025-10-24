import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
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
  finalize,
  first,
  Observable,
  startWith,
  switchMap,
} from 'rxjs';
import { StatusPipe } from '../shared/pipes/status-pipe';
import { AddTaskDialog } from './components/add-task-dialog/add-task-dialog';
import { DateFilterDialog } from './components/date-filter-dialog/date-filter-dialog';
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
  ],
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
  });

  tasks$: Observable<Task[]>;
  tasksChanged$ = new BehaviorSubject<void>(undefined);
  dateRange$ = new BehaviorSubject<{ from: string; to: string } | null>(null);

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
    const dialogRef = this.dialog.open(AddTaskDialog);

    dialogRef.afterClosed().subscribe((payload) => {
      if (payload) {
        this.addTask(payload);
      }
    });
  }

  openDateFilterDialog(): void {
    const dialogRef = this.dialog.open(DateFilterDialog, { data: this.dateRange$.getValue() });

    dialogRef.afterClosed().subscribe((payload) => {
      this.applyDateFilter(payload);
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

  editTask(taskId: string): void {
    console.log('edit: ', taskId);
  }

  private setTasksListener() {
    const searchChanges$ = this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      startWith(this.searchControl.value)
    );

    const statusesChanges$ = this.statusesControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      startWith(this.statusesControl.value)
    );

    this.tasks$ = combineLatest([
      searchChanges$,
      statusesChanges$,
      this.dateRange$.asObservable(),
      this.tasksChanged$.asObservable(),
    ]).pipe(
      switchMap(([search, statuses, dateRangeValue]) => {
        const dateRange = { start: dateRangeValue?.from, end: dateRangeValue?.to };

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
      .subscribe(() => {
        this.tasksChanged$.next();
      });
  }

  private applyDateFilter(payload: { from: Date; to: Date }): void {
    this.dateRange$.next({ from: payload.from.toISOString(), to: payload.to.toISOString() });
  }

  get searchControl() {
    return this.form.controls.search;
  }

  get statusesControl() {
    return this.form.controls.statuses;
  }
}
