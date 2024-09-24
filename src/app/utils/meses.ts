import { GetDiasSemana } from "./functions/diasSemana";
import graficos from "../../assets/progressaoMensal.json" 

export enum Meses {
  "Janeiro" = 0,
  "Fevereiro" = 1,
  "Março" = 2,
  "Abril" = 3,
  "Maio" = 4,
  "Junho" = 5,
  "Julho" = 6,
  "Agosto" = 7,
  "Setembro" = 8,
  "Outubro" = 9,
  "Novembro" = 10, 
  "Dezembro" = 11
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
  entrada: number;
  saida: number;
  constructor(mes: number, ano: number) {
    this.nome = Meses[mes];
    this.nomeAbrev = this.nome.substring(0,3);
    this.valor = mes;
    this.dias = GetDiasSemana(ano, mes+1);
    
    this.entrada = graficos.graficos[ano-2024].meses[mes][0];
    this.saida = graficos.graficos[ano-2024].meses[mes][1];
  }

}

export class Ano {
  valor: number;
  meses: Mes[] = []
  constructor(ano: number){
    this.valor = ano;
    for(var i = 0; i < 12; i++) {
      var mes: Mes = new Mes(i, ano)
      this.meses.push(mes);
    }
  }
}