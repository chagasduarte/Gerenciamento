export interface ParcelaDetalhe {
  descricao: string;
  total_parcelado: number;
  total_pago: number;
  total_pendente: number;
  qtd_parcelas: number;
  qtd_parcelas_pagas: number;
  valor_pendente_mes: number;
  status: 'pago' | 'pendente';
}

export interface DespesasParceladasResponse {
  parcelas: ParcelaDetalhe[];
  mensal: {
    pendente: number;
  };
}
