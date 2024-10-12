import { Parcela } from "../../shared/models/parcela";

export function DefineCorParcela(parcela: Parcela): string {
    return parcela.IsPaga? "#49865b": new Date(parcela.DataVencimento) < new Date()? "#af6e6e" : "#b1ca78";
}