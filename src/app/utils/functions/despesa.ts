import { Despesa } from "../../shared/models/despesa";

export function FormataDespesa(despesa: Despesa) {
    return {
        id: despesa.id,
        nome: despesa.nome,
        descricao: despesa.descricao,
        tipoDespesa: despesa.tipoDespesa,
        valorTotal: despesa.valorTotal,
        valorPago: despesa.valorPago,
        dataCompra: despesa.dataCompra.toISOString(),
        isParcelada: despesa.isParcelada,
        isPaga: despesa.isPaga,
    }
}