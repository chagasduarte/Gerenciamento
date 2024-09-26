export class Graficos {
  meses: MesGrafico[];

  constructor() {
    this.meses = [];
  }
}

export interface MesGrafico {
  id: number;
  nomeAbrev: string;
  entrada: number;
  saida: number;
  progressao: number;
}