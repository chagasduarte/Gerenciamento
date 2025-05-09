export interface Parcela {
    Id: number
    DespesaId: number
    Valor: number
    DataVencimento: Date
    IsPaga: number
    TipoDespesa: number
    DataVencimentoString: string
    juros: number
}

export interface ParcelaRequest {
    IdDespesa: number
    QtdParcelas: number
    Valor: number
    DataCompra: string
}