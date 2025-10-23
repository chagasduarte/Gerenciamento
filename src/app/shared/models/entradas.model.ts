export interface Entrada {
  id: number;
  descricao: string;
  tipo: string;
  valor: string;
  categoria: string;
  data: string;       // ou Date, se você converter no código
  status: string;
  criada_em: string;  // ou Date
}

export interface EntradasResponse {
  soma_receber: number;
  soma_recebidos: number;
  entradas_receber: Entrada[];
  entradas_recebidas: Entrada[];
}
