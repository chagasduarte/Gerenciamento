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
  Alimentacao = 0,
  Transporte = 1,
  Saude = 2,
  Educacao = 3,
  Lazer = 4,
  Moradia = 5,
  Servicos = 6,
  Outros = 7
}