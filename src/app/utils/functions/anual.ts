import { EChartsOption } from "echarts";

export function DefineGraficoAnualOption(entradas: number[], saidas: number[]): EChartsOption{
   return {
    legend: {
        data: ['entradas', 'saidas'],
        textStyle: {
            color: 'black' // Cor da fonte das legendas
        }
    },
    tooltip: {
      backgroundColor: 'rgba(50,50,50,0.7)',
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
          formatter: '{c}'
        }
      },
      {
        name: 'saidas',
        type: 'bar',
        data: saidas,
        label: {
          show: true,
          position: 'top',
          formatter: '{c}'
        }
      }
    ]
  }
}
