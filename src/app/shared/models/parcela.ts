export interface Parcela {
    id: number
    despesaId: number
    valor: number
    dataVencimento: Date
    isPaga: number
}

export interface ParcelaRequest {
    idDespesa: number
    qtdParcelas: number
    valor: number
    dataCompra: string
}