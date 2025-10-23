import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Task } from '../../tasks/data/models/task.model';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const tasks: Task[] = [
      {
        id: '1a7e9c41-3a29-4a7b-a013-7e4ad9e751c1',
        status: 'PENDING',
        title: 'Levar o cachorro para passear',
        date: '2025-10-21T09:14:22.000Z',
        description: 'Some really vague description',
      },
      {
        id: 'b9ef25d2-22fb-45a3-9670-8ccbbf76eae4',
        status: 'IN_PROGRESS',
        title: 'Ir ao mercado',
        date: '2025-10-23T18:42:07.000Z',
        description: 'Some really vague description',
      },
      {
        id: 'fd1825f4-10a1-43db-b8ea-5f6ff1b302a9',
        status: 'PENDING',
        title: 'Lavar o carro',
        date: '2025-10-25T11:37:58.000Z',
        description: 'Some really vague description',
      },
      {
        id: 'c5c8b4e7-fc4a-4a0a-bb59-9c09a4c0907f',
        status: 'IN_PROGRESS',
        title: 'Limpar o quarto',
        date: '2025-10-26T21:03:12.000Z',
        description: 'Some really vague description',
      },
      {
        id: '2df730d1-bb89-4db1-8c9a-b902d53b7d3d',
        status: 'PENDING',
        title: 'Montar o móvel do escritório',
        date: '2025-10-28T07:25:49.000Z',
        description: 'Some really vague description',
      },
      {
        id: 'd8a1e37b-8b64-46b5-bce1-8f44a28b9c93',
        status: 'DONE',
        title: 'Atualizar a planilha de contas',
        date: '2025-10-30T16:48:31.000Z',
        description: 'Some really vague description',
      },
      {
        id: '94b6ac17-7a6c-42b5-a98d-2eae1c7c6b51',
        status: 'PENDING',
        title: 'Comprar ingresso do show',
        date: '2025-11-01T13:52:00.000Z',
        description: 'Some really vague description',
      },
      {
        id: 'f61ff742-478f-49a3-88c5-4b8e3a84e4b5',
        status: 'DONE',
        title: 'Pagar os impostos',
        date: '2025-11-02T22:10:43.000Z',
        description: 'Some really vague description',
      },
      {
        id: 'a2c2f35e-4e0e-4da2-aac2-62c9c172bca7',
        status: 'PENDING',
        title: 'Marcar trilha com os amigos',
        date: '2025-11-04T08:17:25.000Z',
        description: 'Some really vague description',
      },
      {
        id: 'b37cc4c6-91a3-4584-92c3-88c69b1879c1',
        status: 'DONE',
        title: 'Comprar um quadro para a sala',
        date: '2025-11-06T15:33:09.000Z',
        description: 'Some really vague description',
      },
      {
        id: 'e47fda29-88c3-44c4-8c6c-7a4c1f548d32',
        status: 'PENDING',
        title: 'Assistir recomendação de filme',
        date: '2025-11-08T19:47:50.000Z',
        description: 'Some really vague description',
      },
      {
        id: 'ab673dc3-0b7f-46e0-929b-c9a5a2f11271',
        status: 'DONE',
        title: 'Ler o livro',
        date: '2025-11-10T06:05:17.000Z',
        description: 'Some really vague description',
      },
      {
        id: 'cb43dc7f-31e0-42f5-8e3f-22bc2b1a24de',
        status: 'PENDING',
        title: 'Fazer receita do bolo',
        date: '2025-11-12T14:21:03.000Z',
        description: 'Some really vague description',
      },
      {
        id: 'f0a2a4c3-1ed5-41e8-b06f-9b41caa7df18',
        status: 'IN_PROGRESS',
        title: 'Tirar a carne do congelador',
        date: '2025-11-14T23:59:41.000Z',
        description: 'Some really vague description',
      },
      {
        id: 'b8d2e3f7-5a9d-4808-b23a-5a7997cf1f8f',
        status: 'PENDING',
        title: 'Levar o lixo para fora',
        date: '2025-11-16T10:08:54.000Z',
        description: 'Some really vague description',
      },
      {
        id: 'fbbf44a1-bae2-4e0d-9ac6-7024a33b4a47',
        status: 'DONE',
        title: 'Mandar o carro para polir',
        date: '2025-11-18T17:29:35.000Z',
        description: 'Some really vague description',
      },
      {
        id: 'c9e81df4-d73a-41f7-9de7-02dbfb2b8cc1',
        status: 'DONE',
        title: 'Arrumar maçaneta da porta do quarto',
        date: '2025-11-21T20:44:10.000Z',
        description: 'Some really vague description',
      },
      {
        id: '1d9a239b-5cb4-4e25-a03c-260b7f41f8a9',
        status: 'IN_PROGRESS',
        title: 'Comprar suporte para celular',
        date: '2025-11-24T05:56:28.000Z',
        description: 'Some really vague description',
      },
      {
        id: 'e5d203f1-39cb-44e5-b43a-54862b22956a',
        status: 'IN_PROGRESS',
        title: 'Marcar consulta médica',
        date: '2025-11-26T12:32:47.000Z',
        description: 'Some really vague description',
      },
      {
        id: 'f31d72a6-b6b0-4eb9-b589-1fa7d00f10ac',
        status: 'DONE',
        title: 'Ir ao oftalmologista',
        date: '2025-11-29T18:15:03.000Z',
        description: 'Some really vague description',
      },
    ];

    return { tasks };
  }
}
