export class Pagamento {
    TipoPagamento!: TipoPagamento;
    IdPagamento!: number;
}

enum TipoPagamento {
    Parcela = 1,
    Despesa = 2
}