export interface CartaoCredito {
  id?: number;
  nome: string;
  limite_total: number;
  valor_utilizado?: number;
  data_fechamento?: string; // formato ISO
  data_pagamento?: string;  // formato ISO
  ativa?: boolean;
  criada_em?: string;
}
