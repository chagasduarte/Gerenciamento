import { GetDiasSemana } from "./functions/diasSemana";

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

export class Dia {
  diaMes: number;
  diaSemana: string;
  constructor(diaMes: number, diaSem: string){
    this.diaMes = diaMes;
    this.diaSemana = diaSem;
  }
}

export class Mes {
  nome!: string;
  nomeAbrev!: string;
  valor!: number;
  dias!: Dia[];

  constructor(valor: number) {
    this.nome = Meses[valor];
    this.nomeAbrev = this.nome.substring(0,3);
    this.valor = valor;
    this.dias = GetDiasSemana( 2024, valor)
  }
}

export class Ano {
  meses: Mes[] = []
  constructor(){
    for(var i = 1; i <= 12; i++) {
      var mes: Mes = new Mes(i)
      this.meses.push(mes);
    }
  }
}