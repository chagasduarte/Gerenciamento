export interface Parcela {
    id: number
    despesaId: number
    valor: number
    diaVencimento: number
    mesVencimento: number
    anoVencimento: number
    status: number
}

export interface ParcelaRequest {
    idDespesa: number
    qtdParcelas: number
    valor: number
    dataCompra: string
}