// src/app/objetivos/models/objetivo.model.ts
export interface Objetivo {
  atualizado_em: Date
  criado_em: Date;
  data_final: Date;
  data_inicio: Date;
  id: number;
  nome: string;
  status: 'em_dia' | 'atrasado' | 'concluido';
  tipo: 'Curto' | 'Medio' | 'Longo';
  usuario_id: number
  valor_acumulado: number;
  valor_mensal: number;
  valor_objetivo: number;
}
