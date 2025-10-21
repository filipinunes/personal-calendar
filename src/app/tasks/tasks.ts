import { Component, inject, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { PeriodicElement, TasksService } from './data/tasks.service';
import { Observable, tap } from 'rxjs';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.html',
  styleUrl: './tasks.css',
  standalone: false,
})
export class Tasks {
  displayedColumns: string[] = ['title', 'status', 'date', 'description', 'action'];
  dataSource!: MatTableDataSource<PeriodicElement>;
  form!: FormGroup;
  tasks$!: Observable<PeriodicElement[]>;

  tasksService = inject(TasksService);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor() {}

  ngOnInit() {
    this.form = new FormGroup({
      search: new FormControl(''),
    });
  }

  ngAfterViewInit() {
    this.tasks$ = this.tasksService.getTasks().pipe(
      tap((tasks) => {
        this.dataSource = new MatTableDataSource(tasks);
        this.dataSource.paginator = this.paginator;
      })
    );
  }

  deleteTask(e: any) {
    console.log('delete: ', e);
  }

  concludeTask(e: any) {
    console.log('conclude: ', e);
  }

  get searchControl(): FormControl {
    return this.form.get('search') as FormControl;
  }
}
