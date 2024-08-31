import { Entrada } from "../../shared/models/entradas";

export function FormataEntrada (entrada: Entrada) {
    return {
        nome: entrada.nome,
        valor: entrada.valor,
        contaId: entrada.contaId,
        dataDebito: entrada.dataDebito.toISOString(),
        isFixo: false,
        status: false
    }
}