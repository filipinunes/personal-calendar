import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { v4 as uuid } from 'uuid';
import { Task } from '../../tasks/data/models/task.model';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const tasks: Task[] = [
      {
        id: uuid(),
        title: 'Estudar Angular',
        description: 'Revisar componentes standalone e RxJS',
        date: '2025-10-22',
        status: 'IN_PROGRESS',
      },
      {
        id: uuid(),
        title: 'Ir à academia',
        description: 'Treino de peito e tríceps',
        date: '2025-10-23',
        status: 'PENDING',
      },
      {
        id: uuid(),
        title: 'Reunião de projeto',
        description: 'Apresentar resultados do sprint',
        date: '2025-10-24',
        status: 'DONE',
      },
    ];

    return { tasks };
  }
}
