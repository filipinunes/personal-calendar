import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { v4 as uuid } from 'uuid';
import { Task } from '../models/task.model';
import { TasksApi, TasksApiFilters } from './tasks-api.interface';

@Injectable({
  providedIn: 'root',
})
export class TasksService implements TasksApi {
  private apiUrl = 'api/tasks';

  constructor(private http: HttpClient) {}

  getTasks(filters?: TasksApiFilters): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl).pipe(
      map((tasks) => {
        let filtered = [...tasks];

        if (filters?.search?.trim()) {
          const search = filters.search.trim().toLowerCase();
          filtered = filtered.filter((task) => task.title.toLowerCase().includes(search));
        }

        if (filters?.statuses && filters.statuses.length > 0) {
          filtered = filtered.filter((task) => filters.statuses!.includes(task.status));
        }

        if (filters?.dateRange?.start && filters?.dateRange?.end) {
          const start = new Date(filters.dateRange.start);
          const end = new Date(filters.dateRange.end);

          filtered = filtered.filter((task) => {
            const taskDate = new Date(task.date);
            return taskDate >= start && taskDate <= end;
          });
        }

        return filtered;
      })
    );
  }

  getTaskById(id: string): Observable<Task | undefined> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`);
  }

  createTask(task: Omit<Task, 'id'>): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, { ...task, id: uuid() });
  }

  updateTask(id: string, task: Partial<Task>): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, task);
  }

  deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
