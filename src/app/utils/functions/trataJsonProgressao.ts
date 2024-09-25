
// Definindo a estrutura do JSON
interface Grafico {
    progressao: number[];
    meses: number[][];
}

interface Dados {
    graficos: Grafico[];
}

// Função para atualizar o JSON
export function atualizarJson(ano: number, mes: number, tipo: 'entrada' | 'saida' | 'progressao', valor: number) {
    // Lendo o arquivo JSON
    const data: Dados = {graficos: []};
    // Verificando se o ano e o mês são válidos
    const indiceAno = ano - 2024; // Ajuste conforme o ano base
    if (indiceAno < 0 || indiceAno >= data.graficos.length) {
        console.error('Ano inválido.');
        return;
    }
    
    if (mes < 0 || mes > 11) {
        console.error('Mês inválido.');
        return;
    }
    
    const indiceMes = mes; // Ajuste para índice baseado em 0

    // Atualizando o valor conforme o tipo
    switch (tipo) {
        case 'entrada':
            data.graficos[indiceAno].meses[indiceMes][0] = valor;
            break;
        case 'saida':
            data.graficos[indiceAno].meses[indiceMes][1] = valor;
            break;
        case 'progressao':
            data.graficos[indiceAno].progressao[indiceMes] = valor;
            break;
        default:
            console.error('Tipo inválido.');
            return;
    }

}
