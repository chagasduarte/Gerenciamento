export interface Parcela {
    Id: number
    DespesaId: number
    Valor: number
    DataVencimento: Date
    IsPaga: number
}

export interface ParcelaRequest {
    IdDespesa: number
    QtdParcelas: number
    Valor: number
    DataCompra: string
}