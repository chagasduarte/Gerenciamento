import { EChartsOption } from "echarts";
import { Despesa } from "../../shared/models/despesa";
import { TipoDespesa } from "../../shared/models/tipoDespesa";

export function DefineGraficoCategoria(despesas: Despesa[]): EChartsOption {

  let data: {value: number, name: string}[] = [];
  let legend: string[] = []
  despesas.forEach(despesa => {
    if (data[despesa.tipoDespesa]){
      data[despesa.tipoDespesa].value += despesa.valorTotal;
    }
    else {
      data[despesa.tipoDespesa] = {value: despesa.valorTotal, name: TipoDespesa[despesa.tipoDespesa]};
    }
  });

  return {
    title: {
      text: 'Gastos Mensais',
      subtext: 'Porcentagem por Categoria',
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      data: legend
    },
    series: [
      {
        name: 'Categorias',
        type: 'pie',
        radius: '50%',
        data: data
      }
    ]
  }
}
