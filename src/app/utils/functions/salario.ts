export function GetSalarioLiquido(salarioBruto: number) {
        let retorno: resultados[] = [];
        retorno[0] = {nome:"INSS", valor: calcularINSS(salarioBruto)}
        const baseIRRF = salarioBruto - retorno[0].valor;
        retorno[1] = { nome: "IRRF", valor:calcularIRRF(baseIRRF)};
        retorno[2] = {nome: "Liquido", valor: salarioBruto - retorno[0].valor - retorno[1].valor} ;
        return retorno;
}
interface resultados {
    nome: string
    valor: number
}
function calcularINSS(salarioBruto: number): number {
    const faixasINSS = [
        { limite: 1412.00, aliquota: 0.075 },
        { limite: 2666.68, aliquota: 0.09 },
        { limite: 4000.03, aliquota: 0.12 },
        { limite: 7786.02, aliquota: 0.14 }
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
        { limite: 2259.20, aliquota: 0.00, deducao: 0 },
        { limite: 2826.65, aliquota: 0.075, deducao: 169.44 },
        { limite: 3751.05, aliquota: 0.15, deducao: 381.44 },
        { limite: 4664.68, aliquota: 0.225, deducao: 662.77 },
        { limite: Infinity, aliquota: 0.275, deducao: 896.00 }
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