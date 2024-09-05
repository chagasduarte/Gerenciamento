import { EChartsOption } from "echarts";
import { DefineCor } from "./defineCorGrafico";

export function DefineGraficoProgressaoMensal(saldo: number[]): EChartsOption{
    for (let i =0; i< 12; i++) {
        if (saldo[i]) {
            saldo[i] = parseInt(saldo[i].toString());
        }
        else {
            saldo[i] = 0;
        }
        console.log(saldo[i])
    }
    return {
      tooltip: {
        backgroundColor: '#86AEBC',
        textStyle: {
          color: "black"
        },
        formatter:function(params) {
          return formataValorReal(params);
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
          name: 'saldo',
          type: 'bar',
          data: saldo,
          itemStyle: {
            color: function(params) {
              // params.value é o valor de cada barra
              return DefineCor(parseInt(params.value!.toString())); // Cor vermelha para valores negativos, verde para positivos
            }
          },
          label: {
            show: true,
            position: 'top',
            formatter: function(params) {
              return formataValorReal(params);
            },
            rotate: 90,
            fontSize: '10px'
          }
        }
      ]
    }
  }
function formataValorReal(valor: any){
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
}).format(parseInt(valor.value!.toString()));
}