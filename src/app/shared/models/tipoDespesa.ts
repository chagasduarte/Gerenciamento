export class Despesas {
  Nome!: string
  Valor!: number
  Info: InfoTabela[] = []
}

export class InfoTabela {
    dia: number
    valor: number
    detalhe: string
    
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
  Outros = 7
}