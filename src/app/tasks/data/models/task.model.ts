export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'DONE';

export interface Task {
  id: string;
  date: string;
  title: string;
  description?: string;
  status: TaskStatus;
}
