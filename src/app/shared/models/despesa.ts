import { Parcela } from "./parcela"

export interface Despesa {
    Id: number
    Nome: string
    Descricao: string
    TipoDespesa: number
    ValorTotal: number
    ValorPago: number
    DataCompra: Date
    IsParcelada: boolean
    IsPaga: boolean
    Parcelas: Parcela[]
}