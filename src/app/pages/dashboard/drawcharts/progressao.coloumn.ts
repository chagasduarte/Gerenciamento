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
              font: {color: "#123456"}
            }]);
        var options = {
            backgroundColor: {fill: "none"},
            trendlines: {type: 'linear', lineWidth: 5, opacity: .3},
            legend: {position: 'none'}
        };

        var chart = new google.visualization.ColumnChart(document.getElementById('progressao'));
        
        chart.draw(view, options);
    })
}

function saidasToArray(logs: LogMensal[]): (any)[][]{
    let dados: (any)[][] = [];    
    dados.push(['Mês','Saidas']);
    logs = logs.sort((a, b) => {return a.mes - b.mes})
    logs.forEach(x => {
       dados.push([x.abrevmes, parseFloat(x.valorsaldo.toString())]);
    })
    return dados;
}