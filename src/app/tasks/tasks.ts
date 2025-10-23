import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatPaginator } from '@angular/material/paginator';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {
  BehaviorSubject,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  first,
  Observable,
  startWith,
  switchMap,
} from 'rxjs';
import { StatusPipe } from '../shared/pipes/status-pipe';
import { Task } from './data/models/task.model';
import { TasksService } from './data/services/tasks.service';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { AddTaskDialog } from './components/add-task-dialog/add-task-dialog';

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
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Tasks {
  readonly displayedColumns: string[] = ['title', 'status', 'date', 'description'];

  tasks$!: Observable<Task[]>;
  isLoading = signal(false);
  hasError = signal(false);
  dataSource = signal(new MatTableDataSource<Task>([]));

  form: FormGroup;

  readonly tasksService = inject(TasksService);
  readonly dialog = inject(MatDialog);

  newTask$ = new BehaviorSubject<Task | null>(null);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor() {
    this.form = new FormGroup({
      search: new FormControl(''),
      dateRange: new FormGroup({
        from: new FormControl(''),
        to: new FormControl(''),
      }),
      statuses: new FormControl(''),
    });
  }

  ngOnInit() {
    this.setTasksListener();
    this.setTableDataSourceListener();
  }

  ngAfterViewInit() {
    this.dataSource().paginator = this.paginator;
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AddTaskDialog);

    dialogRef.afterClosed().subscribe((payload) => {
      if (payload) {
        this.addTask(payload);
      }
    });
  }

  private setTasksListener() {
    const searchChanges$ = this.form.controls?.['search'].valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      startWith(this.form.controls?.['search'].value)
    );
    const dateRangeChanges$ = this.form.controls?.['dateRange'].valueChanges.pipe(
      startWith(this.form.controls?.['dateRange'].value)
    );
    const statusesChanges$ = this.form.controls?.['statuses'].valueChanges.pipe(
      startWith(this.form.controls?.['statuses'].value)
    );

    this.tasks$ = combineLatest([
      searchChanges$,
      dateRangeChanges$,
      statusesChanges$,
      this.newTask$,
    ]).pipe(switchMap(([search]) => this.tasksService.getTasks({ search: search as string })));
  }

  private setTableDataSourceListener(): void {
    this.tasks$.subscribe((tasks) => {
      this.dataSource.update((dataSource) => {
        dataSource.data = tasks;

        return dataSource;
      });
    });
  }

  private addTask(payload: Omit<Task, 'id'>) {
    this.tasksService
      .createTask(payload)
      .pipe(first())
      .subscribe((task) => {
        this.newTask$.next(task);
      });
  }

  get searchControl(): FormControl {
    return this.form.controls?.['search'] as FormControl;
  }
}
