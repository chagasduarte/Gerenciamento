export class Despesas {
  Nome!: string
  TipoDespesa!: number
  Info: InfoTabela[] = []
}

export class InfoTabela {
    dia: number
    valor: number
    detalhe: string
    cor!: string
    
    constructor(dia: number, valor: number, detalhe: string){
      this.detalhe = detalhe;
      this.dia = dia;
      this.valor = valor;
    }
}

export enum TipoDespesa {
  Alimentacao = 1,
  Transporte = 2,
  Saude = 3,
  Educacao = 4,
  Lazer = 5,
  Moradia = 6,
  Servicos = 7,
  Outros = 8,
  Investimentos = 9
}