import { color } from "echarts";
import { TipoDespesaGrafico } from "../../../shared/models/graficos";
import { TipoDespesa } from "../../../shared/models/tipoDespesa";
import { Ano } from "../../../utils/meses";

export function drawMediasBar(tipoDespesaAgrupada: TipoDespesaGrafico[], ano: Ano){
    const google = (window as any).google;
    google.charts.load('current', {'packages': ['corechart']});
    const dados = despesaAgrupadaToArray(tipoDespesaAgrupada, ano)
    google.charts.setOnLoadCallback(() => {
        const data = new google.visualization.arrayToDataTable(dados);
        
        var options = {
            backgroundColor: {fill: "none"},
            trendlines: {type: 'linear', lineWidth: 5, opacity: .3},
            legend: {position: 'none'},
            width: 600,
            height: 300,
            annotations: { // Adiciona as anotações
                alwaysOutside: true, // Garante que os valores fiquem fora das barras
                textStyle: {
                    fontSize: 12,
                    bold: true,
                    color: 'white', // Cor do texto
                }
            }
        };
        var chart = new google.visualization.ColumnChart(document.getElementById('medias'));

        chart.draw(data, options);
        // Adicionar as anotações de valor exato sobre as barras
        const formatter = new google.visualization.NumberFormat({ 
            pattern: '#,##0.00' // Define o formato do valor
        });

        // Formatar os valores para exibir na forma de moeda
        formatter.format(data, 1);

        // Chama a função de anotações depois que o gráfico foi desenhado
        google.visualization.events.addListener(chart, 'ready', function () {
            const bars = document.querySelectorAll('.google-visualization-columnchart-bar');
            bars.forEach((bar, index) => {
                const value = parseInt(dados[index + 1][1].toString()); // Pegando o valor da coluna correspondente
                const label = document.createElement('div');
                label.className = 'column-value-label';
                label.innerText = new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }).format(value);

                // Coloca o label sobre a barra
                bar.appendChild(label);
            });
        });
    })
    var medias = document.getElementById('mediaTotal')

    let soma = 0;
    for(let i = 1; i <= 9; i++){
       soma += parseFloat(dados[i][1].toString());
    }

    if(medias){
        medias.innerHTML = new Intl.NumberFormat(
            'pt-BR', {
                style: 'currency',
                currency: 'BRL'
            }
        ).format(soma);
    }
    
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
