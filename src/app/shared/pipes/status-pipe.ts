import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'status',
})
export class StatusPipe implements PipeTransform {
  transform(value: unknown): unknown {
    if (!value) return '-';

    switch (value) {
      case 'PENDING':
        return 'Pendente';
      case 'IN_PROGRESS':
        return 'Em andamento';
      case 'DONE':
        return 'Concluída';
      default:
        return value;
    }
  }
}
