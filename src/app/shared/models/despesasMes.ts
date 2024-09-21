import { TipoDespesa } from "./tipoDespesa"

export interface DespesasMes {
    nome: string,
    valor: number,
    detalhes: string,
    tipoDespesa: number,
    dataCompra: Date,
    isPaga: boolean
}

export class Agrupamento {
    despesas: DespesasMes[];
    tipo: TipoDespesa;
    soma: number;
    constructor(tipo: TipoDespesa, despesas: DespesasMes[]){
        this.soma = 0;
        this.despesas = despesas;
        this.tipo = tipo;
        despesas.map( x => {
            this.soma += x.valor;
        })
    }
}

export class AgrupamentoTipoDespesa {

    agrupamento: Agrupamento[] = [];
    constructor(despesa: DespesasMes[]){
        for(const key in TipoDespesa) {
            if (isNaN(Number(key))) {
                const tipo = parseInt(TipoDespesa[key]);
                this.agrupamento.push(new Agrupamento(tipo, despesa.filter(x => x.tipoDespesa == tipo)))      
            }
        }
    }
}