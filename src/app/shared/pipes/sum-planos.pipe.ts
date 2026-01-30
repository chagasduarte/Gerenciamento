import { Pipe, PipeTransform } from '@angular/core';
import { Planejamento } from '../models/planejamento';

@Pipe({
    name: 'sumPlanos',
    standalone: true
})
export class SumPlanosPipe implements PipeTransform {
    transform(planos: Planejamento[]): number {
        if (!planos) return 0;
        return planos.reduce((acc, current) => acc + parseFloat(current.valor.toString()), 0);
    }
}
