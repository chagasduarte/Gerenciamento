import { TipoDespesaGrafico } from "../../../shared/models/graficos";
import { TipoDespesa } from "../../../shared/models/tipoDespesa";

export function drawCategoriaPie(tipoDespesaAgrupada: TipoDespesaGrafico[], element: string){
    const google = (window as any).google;
    google.charts.load('current', {
        packages: ['corechart'],
        language: 'pt-BR' // garante formatação BR (vírgula decimal, R$, etc)
    });        
    var dash = document.getElementById('dashboard');
    google.charts.setOnLoadCallback(() => {
        const data = new google.visualization.arrayToDataTable(despesaAgrupadaToArray(tipoDespesaAgrupada));
        
        const formatter = new google.visualization.NumberFormat({
            prefix: 'R$ ',
            decimalSymbol: ',',
            groupingSymbol: '.',
            fractionDigits: 2
        });
        formatter.format(data, 1); // aplica na coluna 1 (ajuste se sua coluna de valores for outra)

        var options = {
            title: "Categorias",
            backgroundColor: {fill: "none"},
            is3D: true,
            width: (dash!.offsetWidth / 10) * 9,
            height:300,
            vAxis: {
                format: 'decimal'
            }
        };
        var chart = new google.visualization.PieChart(document.getElementById(element));

        chart.draw(data, options);
    })
}

function despesaAgrupadaToArray(tipoDespesaAgrupada: TipoDespesaGrafico[]): (string | number)[][] {
    let dados: (string | number)[][] = [];
    dados.push(['Categoria', 'Valor']);
    for(const tipo in  TipoDespesa) {
        if(!isNaN(Number(tipo))) {
            const valor = tipoDespesaAgrupada.find(x => x.categoria == Number(tipo))?.media_mensal || 0;
            dados.push([TipoDespesa[tipo], parseInt(valor.toString())])
        }
    }
    return dados;
}