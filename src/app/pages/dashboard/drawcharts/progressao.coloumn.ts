import { LogMensal } from "../../../shared/models/logMensal";

export function drawSaidas(log: LogMensal[]){
    const google = (window as any).google;
    google.charts.load('current', {'packages': ['corechart']});


    google.charts.setOnLoadCallback(() => {
        const data = google.visualization.arrayToDataTable(saidasToArray(log));
        
        var view = new google.visualization.DataView(data);

        view.setColumns([0, 1,
            { calc: "stringify",
              sourceColumn: 1,
              type: "string",
              role: "annotation",
              font: {color: "#ffffff"}
            }]);
        var options = {
            backgroundColor: {fill: "none"},
            trendlines: {type: 'linear', lineWidth: 5, opacity: .3},
            legend: {position: 'none'},
            width: 900,
            height: 300
        };

        var chart = new google.visualization.ColumnChart(document.getElementById('progressao'));
        
        chart.draw(view, options);
    })
}

function saidasToArray(logs: LogMensal[]): (any)[][]{
    let mesAtual = new Date().getUTCMonth() + 1;
    let dados: (any)[][] = [];    
    dados.push(['Mês','Saldo']);
    logs = logs.sort((a, b) => {return a.mes - b.mes})
    logs.forEach(x => {
        // if (x.mes >= mesAtual - 3 && x.mes <= mesAtual + 3) {
            dados.push([x.abrevmes, parseFloat(x.valorsaldo.toString())]);
        // }
    })
    return dados;
}