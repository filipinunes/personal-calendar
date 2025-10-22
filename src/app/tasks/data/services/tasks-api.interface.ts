import { Observable } from 'rxjs';
import { Task } from '../models/task.model';

export interface TasksApi {
  getTasks(filters?: {
    search?: string;
    statuses?: string[];
    dateRange?: { start: string; end: string };
  }): Observable<Task[]>;

  createTask(task: Omit<Task, 'id'>): Observable<Task>;

  updateTask(id: string, task: Partial<Task>): Observable<Task>;

  deleteTask(id: string): Observable<void>;

  getTaskById(id: string): Observable<Task | undefined>;
}
