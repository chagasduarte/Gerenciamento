import { Dia } from "../meses";

// utils.ts
export function GetDiasSemana(ano: number, mes: number): Dia[] {
    // Array com os nomes dos dias da semana
    const diasSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    
    // Array para armazenar os resultados
    const diasMes: Dia[] = [];
    
    // Determina o número de dias no mês
    const daysInMonth = new Date(ano, mes, 0).getDate();
    
    for (let dia = 1; dia <= daysInMonth; dia++) {
      // Cria uma nova data para o dia específico
      const data = new Date(ano, mes, dia);
      // Obtém o índice do dia da semana
      const diaSemana = data.getDay();
      // Adiciona o dia e o nome do dia da semana ao array
      diasMes.push( new Dia(dia, diasSemana[diaSemana] ));
    }
    
    return diasMes;
  }
  