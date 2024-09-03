import { EChartsOption } from "echarts";

export function DefineGraficoAnualOption(entradas: number[], saidas: number[]): EChartsOption{
  for (let i =0; i< 12; i++) {
    entradas[i] = parseInt(entradas[i].toString());
    saidas[i] = parseInt(saidas[i].toString());
  }
  return {
    legend: {
        data: ['entradas', 'saidas'],
        textStyle: {
            color: 'black' // Cor da fonte das legendas
        }
    },
    tooltip: {
      backgroundColor: '#86AEBC',
      textStyle: {
        color: "black"
      }
    },
    xAxis: {
      type:'category',
      data: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
      axisLabel: {
        rotate: 45,
        interval: 0,
        color: "black"
      },
      
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        color: "black"
      }
    },
    series: [
      {
        name: 'entradas',
        type: 'bar',
        data: entradas,
        label: {
          show: true,
          position: 'top',
          formatter: '${c}',
          
        }
      },
      {
        name: 'saidas',
        type: 'bar',
        data: saidas,
        label: {
          show: true,
          position: 'top',
          formatter: '${c}'
        }
      }
    ]
  }
}
