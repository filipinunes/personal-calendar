import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TasksService } from './tasks.service';
import { provideHttpClient } from '@angular/common/http';
import { Task } from '../models/task.model';
import { TasksApiFilters } from './tasks-api.interface';

describe('TaskService', () => {
  let service: TasksService;
  let httpMock: HttpTestingController;
  const apiUrl = 'api/tasks';

  const mockTasks: Task[] = [
    {
      id: '1',
      date: '2024-01-15',
      title: 'Task One',
      description: 'First task',
      status: 'PENDING',
    },
    {
      id: '2',
      date: '2024-01-20',
      title: 'Task Two',
      description: 'Second task',
      status: 'IN_PROGRESS',
    },
    {
      id: '3',
      date: '2024-01-25',
      title: 'Another Task',
      description: 'Third task',
      status: 'DONE',
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(TasksService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getTasks', () => {
    it('should return all tasks when no filters are provided', (done) => {
      service.getTasks().subscribe((tasks) => {
        expect(tasks).toEqual(mockTasks);
        expect(tasks.length).toBe(3);
        done();
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockTasks);
    });

    it('should filter tasks by search term', (done) => {
      const filters: TasksApiFilters = { search: 'Another' };

      service.getTasks(filters).subscribe((tasks) => {
        expect(tasks.length).toBe(1);
        expect(tasks[0].title).toBe('Another Task');
        done();
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush(mockTasks);
    });

    it('should filter tasks by search term (case insensitive)', (done) => {
      const filters: TasksApiFilters = { search: 'TASK ONE' };

      service.getTasks(filters).subscribe((tasks) => {
        expect(tasks.length).toBe(1);
        expect(tasks[0].title).toBe('Task One');
        done();
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush(mockTasks);
    });

    it('should ignore search filter if search term is empty or whitespace', (done) => {
      const filters: TasksApiFilters = { search: '   ' };

      service.getTasks(filters).subscribe((tasks) => {
        expect(tasks.length).toBe(3);
        done();
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush(mockTasks);
    });

    it('should filter tasks by single status', (done) => {
      const filters: TasksApiFilters = { statuses: ['PENDING'] };

      service.getTasks(filters).subscribe((tasks) => {
        expect(tasks.length).toBe(1);
        expect(tasks[0].status).toBe('PENDING');
        done();
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush(mockTasks);
    });

    it('should filter tasks by multiple statuses', (done) => {
      const filters: TasksApiFilters = { statuses: ['PENDING', 'DONE'] };

      service.getTasks(filters).subscribe((tasks) => {
        expect(tasks.length).toBe(2);
        expect(tasks.every((t) => ['PENDING', 'DONE'].includes(t.status))).toBe(true);
        done();
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush(mockTasks);
    });

    it('should ignore status filter if statuses array is empty', (done) => {
      const filters: TasksApiFilters = { statuses: [] };

      service.getTasks(filters).subscribe((tasks) => {
        expect(tasks.length).toBe(3);
        done();
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush(mockTasks);
    });

    it('should filter tasks by date range', (done) => {
      const filters: TasksApiFilters = {
        dateRange: { start: '2024-01-18', end: '2024-01-26' },
      };

      service.getTasks(filters).subscribe((tasks) => {
        expect(tasks.length).toBe(2);
        expect(tasks[0].title).toBe('Task Two');
        expect(tasks[1].title).toBe('Another Task');
        done();
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush(mockTasks);
    });

    it('should include tasks on the boundary dates', (done) => {
      const filters: TasksApiFilters = {
        dateRange: { start: '2024-01-15', end: '2024-01-15' },
      };

      service.getTasks(filters).subscribe((tasks) => {
        expect(tasks.length).toBe(1);
        expect(tasks[0].title).toBe('Task One');
        done();
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush(mockTasks);
    });

    it('should apply multiple filters simultaneously', (done) => {
      const filters: TasksApiFilters = {
        search: 'Task',
        statuses: ['PENDING', 'IN_PROGRESS'],
        dateRange: { start: '2024-01-10', end: '2024-01-20' },
      };

      service.getTasks(filters).subscribe((tasks) => {
        expect(tasks.length).toBe(2);
        expect(tasks[0].title).toBe('Task One');
        expect(tasks[1].title).toBe('Task Two');
        done();
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush(mockTasks);
    });

    it('should return empty array when no tasks match filters', (done) => {
      const filters: TasksApiFilters = { search: 'NonexistentTask' };

      service.getTasks(filters).subscribe((tasks) => {
        expect(tasks).toEqual([]);
        done();
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush(mockTasks);
    });
  });

  describe('getTaskById', () => {
    it('should return a task by id', (done) => {
      const taskId = '1';

      service.getTaskById(taskId).subscribe((task) => {
        expect(task).toEqual(mockTasks[0]);
        done();
      });

      const req = httpMock.expectOne(`${apiUrl}/${taskId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockTasks[0]);
    });

    it('should handle 404 when task is not found', (done) => {
      const taskId = 'non-existent';

      service.getTaskById(taskId).subscribe({
        error: (error) => {
          expect(error.status).toBe(404);
          done();
        },
      });

      const req = httpMock.expectOne(`${apiUrl}/${taskId}`);
      req.flush('Task not found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('createTask', () => {
    it('should create a new task with generated id', (done) => {
      const newTask: Omit<Task, 'id'> = {
        date: '2024-01-30',
        title: 'New Task',
        description: 'New task description',
        status: 'PENDING',
      };

      service.createTask(newTask).subscribe((task) => {
        expect(task.id).toBeDefined();
        expect(task.title).toBe(newTask.title);
        expect(task.status).toBe(newTask.status);
        done();
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body.id).toBeDefined();
      expect(req.request.body.title).toBe(newTask.title);

      req.flush({ ...newTask, id: req.request.body.id });
    });

    it('should generate unique UUID for each task', (done) => {
      const newTask: Omit<Task, 'id'> = {
        date: '2024-01-30',
        title: 'Task',
        status: 'PENDING',
      };

      const ids: string[] = [];

      service.createTask(newTask).subscribe((task) => {
        ids.push(task.id);

        service.createTask(newTask).subscribe((secondTask) => {
          ids.push(secondTask.id);
          expect(ids[0]).not.toBe(ids[1]);
          expect(ids[0]).toMatch(
            /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
          );
          done();
        });

        const req2 = httpMock.expectOne(apiUrl);
        req2.flush({ ...newTask, id: req2.request.body.id });
      });

      const req1 = httpMock.expectOne(apiUrl);
      req1.flush({ ...newTask, id: req1.request.body.id });
    });
  });

  describe('updateTask', () => {
    it('should update an existing task', (done) => {
      const taskId = '1';
      const updates: Partial<Task> = {
        title: 'Updated Title',
        status: 'IN_PROGRESS',
      };

      service.updateTask(taskId, updates).subscribe((task) => {
        expect(task.title).toBe('Updated Title');
        expect(task.status).toBe('IN_PROGRESS');
        done();
      });

      const req = httpMock.expectOne(`${apiUrl}/${taskId}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updates);
      req.flush({ ...mockTasks[0], ...updates });
    });

    it('should handle partial updates', (done) => {
      const taskId = '1';
      const updates: Partial<Task> = { status: 'DONE' };

      service.updateTask(taskId, updates).subscribe((task) => {
        expect(task.status).toBe('DONE');
        expect(task.title).toBe('Task One');
        done();
      });

      const req = httpMock.expectOne(`${apiUrl}/${taskId}`);
      req.flush({ ...mockTasks[0], status: 'DONE' });
    });
  });

  describe('deleteTask', () => {
    it('should delete a task', (done) => {
      const taskId = '1';

      service.deleteTask(taskId).subscribe(() => {
        expect().nothing();
        done();
      });

      const req = httpMock.expectOne(`${apiUrl}/${taskId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });

    it('should handle 404 when deleting non-existent task', (done) => {
      const taskId = 'non-existent';

      service.deleteTask(taskId).subscribe({
        error: (error) => {
          expect(error.status).toBe(404);
          done();
        },
      });

      const req = httpMock.expectOne(`${apiUrl}/${taskId}`);
      req.flush('Task not found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors on getTasks', (done) => {
      service.getTasks().subscribe({
        error: (error) => {
          expect(error.status).toBe(0);
          done();
        },
      });

      const req = httpMock.expectOne(apiUrl);
      req.error(new ProgressEvent('Network error'));
    });

    it('should handle server errors on createTask', (done) => {
      const newTask: Omit<Task, 'id'> = {
        date: '2024-01-30',
        title: 'Task',
        status: 'PENDING',
      };

      service.createTask(newTask).subscribe({
        error: (error) => {
          expect(error.status).toBe(500);
          done();
        },
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
    });
  });
});
