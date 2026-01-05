import { Planejamento } from "./planejamento";

export interface PlanejamentoAgrupadoTipo {
    tipo: string;
    agrupamentoTipo: PlanejamentoAgrupadoCategoria[];
    soma: number;
}

export interface PlanejamentoAgrupadoCategoria {
    categoria: string;
    subcategoria:string;
    valor: number;
    categoriaid: number;
    subcategoriaid: number;
    planejamento: Planejamento[]
    soma: number;
}