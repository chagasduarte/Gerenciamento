import { TipoDespesa } from "./tipoDespesa"

export interface DespesasMes {
    Nome: string,
    Valor: number,
    Detalhes: string,
    TipoDespesa: number,
    DataCompra: Date,
    IsPaga: number
}

export class Agrupamento {
    Despesas: DespesasMes[];
    Tipo: TipoDespesa;
    Soma: number;
    constructor(tipo: TipoDespesa, despesas: DespesasMes[]){
        this.Soma = 0;
        this.Despesas = despesas;
        this.Tipo = tipo;
        despesas.map( x => {
            this.Soma += x.Valor;
        })
    }
}

export class AgrupamentoTipoDespesa {
    Agrupamento: Agrupamento[] = [];
    constructor(despesa: DespesasMes[]){
        for(const key in TipoDespesa) {
            if (isNaN(Number(key))) {
                const tipo = parseInt(TipoDespesa[key]);
                if (despesa.filter(x => x.TipoDespesa == tipo).length > 0) {
                    this.Agrupamento.push(new Agrupamento(tipo, despesa.filter(x => x.TipoDespesa == tipo)))      
                }
            }
        }
    }
}