import { EChartsOption } from "echarts";

export function DefineGraficoOption(entradas: number[], saidas: number[]): EChartsOption{
   return {
    xAxis: {
      type:'category',
      data: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
      axisLabel: {
        rotate: 45,
        interval: 0
      }
    },
    yAxis: {
      type: 'value'
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
