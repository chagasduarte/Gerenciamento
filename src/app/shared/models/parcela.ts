export interface Parcela {
    Id: number
    DespesaId: number
    Valor: number
    DataVencimento: Date
    IsPaga: number
    TipoDespesa: number
    DataVencimentoString: string
    Juros: number
}

export interface ParcelaRequest {
    IdDespesa: number
    QtdParcelas: number
    Valor: number
    DataCompra: string
}