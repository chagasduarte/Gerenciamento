import { Dia } from "../meses";

// utils.ts
export function GetDiasSemana(ano: number, mes: number): Dia[] {
    const diasSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const diasMes: Dia[] = [];
    const daysInMonth = new Date(ano, mes, 0).getUTCDate();
  
    for (let dia = 1; dia <= daysInMonth; dia++) {
      const data = new Date(2024, mes-1, dia);
      const diaSemana = data.getUTCDay();
      diasMes.push( new Dia(dia, diasSemana[diaSemana] ));
    }
    
    return diasMes;
  }
  