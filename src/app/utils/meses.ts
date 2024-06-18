export enum Meses {
  "Janeiro" = 1,
  "Fevereiro" = 2,
  "Março" = 3,
  "Abril" = 4,
  "Maio" = 5,
  "Junho" = 6,
  "Julho" = 7,
  "Agosto" = 8,
  "Setembro" = 9,
  "Outubro" = 10,
  "Novembro" = 11, 
  "Dezembro" = 12
} 

export class Mes {
  nome!: string;
  nomeAbrev!: string;
  valor!: number;
  constructor(nome: string, valor: number) {
    this.nome = nome;
    this.nomeAbrev = nome.substring(0,3);
    this.valor = valor;
  }
}

export class Ano {
  meses: Mes[] = []
  constructor(){
    for(var i = 1; i <= 12; i++) {
      var mes: Mes = new Mes(Meses[i].toString(), i)
      this.meses.push(mes);
    }
  }
}