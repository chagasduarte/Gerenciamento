export class Salario {
    
    calcularSalarioLiquido(salarioBruto: number) {
        let retorno: resultados[] = [];
        retorno[0] = {nome:"INSS", valor: calcularINSS(salarioBruto)}
        const baseIRRF = salarioBruto - retorno[0].valor;
        retorno[1] = { nome: "IRRF", valor:calcularIRRF(baseIRRF)};
        retorno[2] = {nome: "Liquido", valor: salarioBruto - retorno[0].valor - retorno[1].valor} ;
        return retorno;
    }


}
interface resultados {
    nome: string
    valor: number
}
function calcularINSS(salarioBruto: number): number {
    const faixasINSS = [
        { limite: 1302.00, aliquota: 0.075 },
        { limite: 2571.29, aliquota: 0.09 },
        { limite: 3856.94, aliquota: 0.12 },
        { limite: 7507.49, aliquota: 0.14 }
    ];

    let valorINSS = 0;
    let salarioRestante = salarioBruto;

    for (const faixa of faixasINSS) {
        if (salarioRestante > faixa.limite) {
            valorINSS += faixa.limite * faixa.aliquota;
            salarioRestante -= faixa.limite;
        } else {
            valorINSS += salarioRestante * faixa.aliquota;
            break;
        }
    }

    return valorINSS;
}

function calcularIRRF(baseIRRF: number): number {
    const faixasIRRF = [
        { limite: 1903.98, aliquota: 0.00, deducao: 0 },
        { limite: 2826.65, aliquota: 0.075, deducao: 142.80 },
        { limite: 3751.05, aliquota: 0.15, deducao: 354.80 },
        { limite: 4664.68, aliquota: 0.225, deducao: 636.13 },
        { limite: Infinity, aliquota: 0.275, deducao: 869.36 }
    ];

    let impostoIRRF = 0;

    for (const faixa of faixasIRRF) {
        if (baseIRRF > faixa.limite) {
            impostoIRRF = faixa.limite * faixa.aliquota - faixa.deducao;
        } else {
            impostoIRRF = baseIRRF * faixa.aliquota - faixa.deducao;
            break;
        }
    }

    return impostoIRRF;
}