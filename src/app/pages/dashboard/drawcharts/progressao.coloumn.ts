import { MesGrafico } from "../../../shared/models/graficos";
import { Projecao } from "../../../shared/models/projecao.model";

export function drawProjecoes(log: Projecao[]){
    const google = (window as any).google;
    google.charts.load('current', {
        packages: ['corechart'],
        language: 'pt-BR' // garante formatação BR (vírgula decimal, R$, etc)
    });    
    var dash = document.getElementById('dashboard');

    google.charts.setOnLoadCallback(() => {
        const data = google.visualization.arrayToDataTable(saidasToArray(log));
        
        const formatter = new google.visualization.NumberFormat({
            prefix: 'R$ ',
            decimalSymbol: ',',
            groupingSymbol: '.',
            fractionDigits: 2
        });

        // 🧮 Aplica o formato em todas as colunas numéricas (exceto a primeira, que é o eixo X)
        const numCols = data.getNumberOfColumns();
        for (let i = 1; i < numCols; i++) {
            formatter.format(data, i);
        }
        var options = {
            title: 'Progressão',
            backgroundColor: {fill: "none"},
            seriesType: 'bars',
            series: {0: {type: 'line'}, 1: {type: 'line'}},
            width: (dash!.offsetWidth / 10) * 9,
            height: 300,
            colors: ['red', 'blue', '#1b9e77', 'orange'],
            vAxis: {
                format: 'decimal'
            }
        };

        var chart = new google.visualization.ComboChart(document.getElementById('progressao'));
        
        chart.draw(data, options);
    })
}

function saidasToArray(logs: Projecao[]): (any)[][]{
    let dados: (any)[][] = [];    
    dados.push(['Mês','Progressão', 'Saldo Mensal' ,'Entradas',  'Saídas']);
    logs = logs.sort((a, b) => {return a.mes - b.mes})
    logs.forEach(x => {
        // if (x.id >= mesAtual - 2 && x.id <= mesAtual + 3) {
            dados.push([nomeMes(x.mes), 
                parseFloat(x.saldo_acumulado.toString()), 
                parseFloat(x.saldo_mensal.toString()),
                parseFloat(x.soma_entrada.toString()), 
                parseFloat(x.soma_saida.toString())]);
        // }
    })
    return dados;
}

function nomeMes(mes: number) {
    const nomes = [
      'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
      'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
    ];
    return nomes[mes - 1] || '';
}