import { Entrada } from "../../shared/models/entradas";

export function FormataEntrada (entrada: Entrada) {
    return {
        nome: entrada.Nome,
        valor: entrada.Valor,
        contaId: entrada.ContaId,
        dataDebito: entrada.DataDebito.toISOString(),
        isFixo: false,
        status: false
    }
}