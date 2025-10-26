import { Observable } from 'rxjs';
import { Task } from '../models/task.model';

export interface TasksApiFilters {
  search?: string | null;
  statuses?: string[] | null;
  dateRange?: { start?: Date | null; end?: Date | null };
}

export interface TasksApi {
  getTasks(filters?: TasksApiFilters): Observable<Task[]>;

  createTask(task: Omit<Task, 'id'>): Observable<Task>;

  updateTask(id: string, task: Partial<Task>): Observable<void>;

  deleteTask(id: string): Observable<void>;

  getTaskById(id: string): Observable<Task | undefined>;
}
