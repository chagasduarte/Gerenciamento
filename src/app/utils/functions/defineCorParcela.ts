import { Parcela } from "../../shared/models/parcela";

export function DefineCorParcela(parcela: Parcela): string {
    return parcela.isPaga? "#49865b": new Date(parcela.dataVencimento) < new Date()? "#af6e6e" : "#b1ca78";
}