import { color } from "echarts";
import { TipoDespesaGrafico } from "../../../shared/models/graficos";
import { TipoDespesa } from "../../../shared/models/tipoDespesa";
import { Ano } from "../../../utils/meses";
import { title } from "node:process";

export function drawMediasBar(tipoDespesaAgrupada: TipoDespesaGrafico[], ano: Ano){
    const google = (window as any).google;
    google.charts.load('current', {'packages': ['corechart']});
    const dados = despesaAgrupadaToArray(tipoDespesaAgrupada, ano);
    var dash = document.getElementById('dashboard');

    google.charts.setOnLoadCallback(() => {
        const data = new google.visualization.arrayToDataTable(dados);
        
        var options = {
            title: "Médias",
            backgroundColor: {fill: "none"},
            trendlines: {type: 'linear', lineWidth: 5, opacity: .3},
            width: (dash!.offsetWidth / 10) * 9,
            height: 300,
            vAxis: {
                format: '$.00'
            }
        };
        var chart = new google.visualization.ColumnChart(document.getElementById('medias'));

        chart.draw(data, options);
        
    });
    
}

function despesaAgrupadaToArray(tipoDespesaAgrupada: TipoDespesaGrafico[], ano: Ano): (string | number)[][] {
    let dados: (string | number)[][] = [];
    dados.push(['Categoria', 'Valor']);
    for(const tipo in  TipoDespesa) {
        if(!isNaN(Number(tipo))) {
            const valor = tipoDespesaAgrupada.find(x => x.TipoDespesa == Number(tipo))?.saida || 0;
            let meses = 0;
            if(Number(tipo) == 2 || Number(tipo) == 6){
                meses = 12;
            }
            else {
                meses = ano.meses.length
            }
            dados.push([TipoDespesa[tipo], valor/meses])
        }
    }
    return dados;
}
