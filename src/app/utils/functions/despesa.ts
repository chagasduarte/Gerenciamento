import { Despesa } from "../../shared/models/despesa";

export function FormataDespesa(despesa: Despesa) {
    return {
        id: despesa.Id,
        nome: despesa.Nome,
        descricao: despesa.Descricao,
        tipoDespesa: despesa.TipoDespesa,
        valorTotal: despesa.ValorTotal,
        valorPago: despesa.ValorPago,
        dataCompra: despesa.DataCompra.toISOString(),
        isParcelada: despesa.IsParcelada,
        isPaga: despesa.IsPaga,
    }
}