import { Parcela } from "./parcela"

export interface Despesa {
    id: number
    nome: string
    descricao: string
    tipoDespesa: number
    valorTotal: number
    valorPago: number
    diaCompra: number
    mesCompra: number
    anoCompra: number
    isFixa: boolean
    status: boolean
    parcelas: Parcela[]
}