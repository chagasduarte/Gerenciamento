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
  nomeAbrev: string;
  entrada: number;
  saida: number;
  progressao: number;
}

export interface TipoDespesaGrafico {
  tipoDespesa: TipoDespesa;
  valorTotal: number;
}