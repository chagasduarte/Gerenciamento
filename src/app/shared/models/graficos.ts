import { TipoDespesa } from "./tipoDespesa";

export class Graficos {
  meses: MesGrafico[];
  tipoDespesaAgrupada: TipoDespesaGrafico[];

  constructor() {
    this.meses = [];
    this.tipoDespesaAgrupada = [];
  }
}

export interface MesGrafico {
  id: number;
  nomeabrev: string;
  entrada: number;
  saida: number;
  progressao: number;
}

export interface TipoDespesaGrafico {
  categoria: TipoDespesa;
  media_mensal: number;
}