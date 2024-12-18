import { TipoDespesaGrafico } from "../../../shared/models/graficos";
import { TipoDespesa } from "../../../shared/models/tipoDespesa";

export function drawCategoriaPie(tipoDespesaAgrupada: TipoDespesaGrafico[]){
    const google = (window as any).google;
    google.charts.load('current', {'packages': ['corechart']});
    google.charts.setOnLoadCallback(() => {
        const data = new google.visualization.arrayToDataTable(despesaAgrupadaToArray(tipoDespesaAgrupada));
        var options = {
            backgroundColor: {fill: "none"},
            is3D: true
        };
        var chart = new google.visualization.PieChart(document.getElementById('pizza'));

        chart.draw(data, options);
    })
}

function despesaAgrupadaToArray(tipoDespesaAgrupada: TipoDespesaGrafico[]): (string | number)[][] {
    let dados: (string | number)[][] = [];
    dados.push(['Categoria', 'Valor']);
    for(const tipo in  TipoDespesa) {
        if(!isNaN(Number(tipo))) {
            const valor = tipoDespesaAgrupada.find(x => x.TipoDespesa == Number(tipo))?.saida || 0;
            dados.push([TipoDespesa[tipo], valor])
        }
    }
    return dados;
}