import { MesGrafico } from "../../../shared/models/graficos";

export function drawSaidas(log: MesGrafico[]){
    const google = (window as any).google;
    google.charts.load('current', {'packages': ['corechart']});


    google.charts.setOnLoadCallback(() => {
        const data = google.visualization.arrayToDataTable(saidasToArray(log));
        
        var view = new google.visualization.DataView(data);
        var dash = document.getElementById('dashboard');
        console.log(dash!.offsetWidth);
        var options = {
            title: 'Progressão',
            backgroundColor: {fill: "none"},
            seriesType: 'bars',
            series: {0: {type: 'line'}},
            width: (dash!.offsetWidth / 10) * 9,
            height: 300,
            colors: ['red', '#1b9e77', 'orange'],
            vAxis: {
                format: '$.00'
            }
        };

        var chart = new google.visualization.ComboChart(document.getElementById('progressao'));
        
        chart.draw(view, options);
    })
}

function saidasToArray(logs: MesGrafico[]): (any)[][]{
    let dados: (any)[][] = [];    
    dados.push(['Mês','Progressão', 'Entradas',  'Saídas']);
    logs = logs.sort((a, b) => {return a.id - b.id})
    logs.forEach(x => {
        // if (x.id >= mesAtual - 2 && x.id <= mesAtual + 3) {
            dados.push([x.nomeabrev, parseFloat(x.progressao.toString()), parseFloat(x.entrada.toString()), parseFloat(x.saida.toString())]);
        // }
    })
    return dados;
}