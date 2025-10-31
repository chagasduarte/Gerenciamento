export interface CartaoCredito {
  id: number;
  descricao: string;
  valor: number;
  data_compra?: number;
  data_fechamento: string; // formato ISO
  data_fatura: string;  // formato ISO
  status: boolean;
  parcela_total: number;
  parcela_atual: number;
}
