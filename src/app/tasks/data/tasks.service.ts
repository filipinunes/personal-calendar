import { Injectable } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';

@Injectable()
export class TasksService {
  constructor() {}

  getTasks(): Observable<PeriodicElement[]> {
    return of(this.getTasksFromStorage());
  }

  createTask(task: PeriodicElement): Observable<PeriodicElement> {
    return of(null).pipe(
      switchMap(() => {
        const tasks = this.getTasksFromStorage();
        const updatedTasks = [...tasks, task];

        this.setTasksToStorage(updatedTasks);

        return updatedTasks;
      })
    );
  }

  deleteTask(taskId: string): Observable<PeriodicElement[]> {
    const tasks = this.getTasksFromStorage();
    const updatedTasks = tasks.filter((task) => task.id !== taskId);

    this.setTasksToStorage(updatedTasks);

    return of(updatedTasks);
  }

  private getTasksFromStorage(): PeriodicElement[] {
    const tasks = localStorage.getItem('tasks');

    if (!tasks) {
      this.setTasksToStorage(ELEMENT_DATA);

      return [];
    }

    return JSON.parse(tasks);
  }

  private setTasksToStorage(tasks: PeriodicElement[]): void {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }
}

export interface PeriodicElement {
  id: string;
  title: string;
  date: Date;
  status: 'pending' | 'doing' | 'concluded';
  description: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    id: '1a7e9c41-3a29-4a7b-a013-7e4ad9e751c1',
    status: 'pending',
    title: 'Levar o cachorro para passear',
    date: new Date('2025-10-21T09:14:22Z'),
    description: 'Some really vague description',
  },
  {
    id: 'b9ef25d2-22fb-45a3-9670-8ccbbf76eae4',
    status: 'doing',
    title: 'Ir ao mercado',
    date: new Date('2025-10-23T18:42:07Z'),
    description: 'Some really vague description',
  },
  {
    id: 'fd1825f4-10a1-43db-b8ea-5f6ff1b302a9',
    status: 'pending',
    title: 'Lavar o carro',
    date: new Date('2025-10-25T11:37:58Z'),
    description: 'Some really vague description',
  },
  {
    id: 'c5c8b4e7-fc4a-4a0a-bb59-9c09a4c0907f',
    status: 'doing',
    title: 'Limpar o quarto',
    date: new Date('2025-10-26T21:03:12Z'),
    description: 'Some really vague description',
  },
  {
    id: '2df730d1-bb89-4db1-8c9a-b902d53b7d3d',
    status: 'pending',
    title: 'Montar o móvel do escritório',
    date: new Date('2025-10-28T07:25:49Z'),
    description: 'Some really vague description',
  },
  {
    id: 'd8a1e37b-8b64-46b5-bce1-8f44a28b9c93',
    status: 'concluded',
    title: 'Atualizar a planilha de contas',
    date: new Date('2025-10-30T16:48:31Z'),
    description: 'Some really vague description',
  },
  {
    id: '94b6ac17-7a6c-42b5-a98d-2eae1c7c6b51',
    status: 'pending',
    title: 'Comprar ingresso do show',
    date: new Date('2025-11-01T13:52:00Z'),
    description: 'Some really vague description',
  },
  {
    id: 'f61ff742-478f-49a3-88c5-4b8e3a84e4b5',
    status: 'concluded',
    title: 'Pagar os impostos',
    date: new Date('2025-11-02T22:10:43Z'),
    description: 'Some really vague description',
  },
  {
    id: 'a2c2f35e-4e0e-4da2-aac2-62c9c172bca7',
    status: 'pending',
    title: 'Marcar trilha com os amigos',
    date: new Date('2025-11-04T08:17:25Z'),
    description: 'Some really vague description',
  },
  {
    id: 'b37cc4c6-91a3-4584-92c3-88c69b1879c1',
    status: 'concluded',
    title: 'Comprar um quadro para a sala',
    date: new Date('2025-11-06T15:33:09Z'),
    description: 'Some really vague description',
  },
  {
    id: 'e47fda29-88c3-44c4-8c6c-7a4c1f548d32',
    status: 'pending',
    title: 'Assistir recomendação de filme',
    date: new Date('2025-11-08T19:47:50Z'),
    description: 'Some really vague description',
  },
  {
    id: 'ab673dc3-0b7f-46e0-929b-c9a5a2f11271',
    status: 'concluded',
    title: 'Ler o livro',
    date: new Date('2025-11-10T06:05:17Z'),
    description: 'Some really vague description',
  },
  {
    id: 'cb43dc7f-31e0-42f5-8e3f-22bc2b1a24de',
    status: 'pending',
    title: 'Fazer receita do bolo',
    date: new Date('2025-11-12T14:21:03Z'),
    description: 'Some really vague description',
  },
  {
    id: 'f0a2a4c3-1ed5-41e8-b06f-9b41caa7df18',
    status: 'doing',
    title: 'Tirar a carne do congelador',
    date: new Date('2025-11-14T23:59:41Z'),
    description: 'Some really vague description',
  },
  {
    id: 'b8d2e3f7-5a9d-4808-b23a-5a7997cf1f8f',
    status: 'pending',
    title: 'Levar o lixo para fora',
    date: new Date('2025-11-16T10:08:54Z'),
    description: 'Some really vague description',
  },
  {
    id: 'fbbf44a1-bae2-4e0d-9ac6-7024a33b4a47',
    status: 'concluded',
    title: 'Mandar o carro para polir',
    date: new Date('2025-11-18T17:29:35Z'),
    description: 'Some really vague description',
  },
  {
    id: 'c9e81df4-d73a-41f7-9de7-02dbfb2b8cc1',
    status: 'concluded',
    title: 'Arrumar maçaneta da porta do quarto',
    date: new Date('2025-11-21T20:44:10Z'),
    description: 'Some really vague description',
  },
  {
    id: '1d9a239b-5cb4-4e25-a03c-260b7f41f8a9',
    status: 'doing',
    title: 'Comprar suporte para celular',
    date: new Date('2025-11-24T05:56:28Z'),
    description: 'Some really vague description',
  },
  {
    id: 'e5d203f1-39cb-44e5-b43a-54862b22956a',
    status: 'doing',
    title: 'Marcar consulta médica',
    date: new Date('2025-11-26T12:32:47Z'),
    description: 'Some really vague description',
  },
  {
    id: 'f31d72a6-b6b0-4eb9-b589-1fa7d00f10ac',
    status: 'concluded',
    title: 'Ir ao oftalmologista',
    date: new Date('2025-11-29T18:15:03Z'),
    description: 'Some really vague description',
  },
];
