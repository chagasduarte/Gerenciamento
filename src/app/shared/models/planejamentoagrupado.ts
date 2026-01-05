import { Planejamento } from "./planejamento";

export interface PlanejamentoAgrupadoTipo {
    tipo: string;
    agrupamentoTipo: PlanejamentoAgrupadoCategoria[];
    soma: number;
}

export interface PlanejamentoAgrupadoCategoria {
    categoria: string;
    planejamento: Planejamento[]
    soma: number;
}