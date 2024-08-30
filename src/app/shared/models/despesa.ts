import { Parcela } from "./parcela"

export interface Despesa {
    id: number
    nome: string
    descricao: string
    tipoDespesa: number
    valorTotal: number
    valorPago: number
    dataCompra: Date
    isParcelada: boolean
    isPaga: boolean
    parcelas: Parcela[]
}