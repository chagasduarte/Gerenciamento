import { EChartsOption } from "echarts";

export function DefineGraficoCategoria(): EChartsOption {
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
            data: ['Alimentação', 'Transporte', 'Saúde', 'Educação', 'Lazer', 'Moradia', 'Serviços', 'Outros']
          },
          series: [
            {
              name: 'Categorias',
              type: 'pie',
              radius: '50%',
              data: [
                { value: 20, name: 'Alimentação' },
                { value: 10, name: 'Transporte' },
                { value: 15, name: 'Saúde' },
                { value: 10, name: 'Educação' },
                { value: 10, name: 'Lazer' },
                { value: 20, name: 'Moradia' },
                { value: 10, name: 'Serviços' },
                { value: 5, name: 'Outros' }
              ]
            }
          ]
      }
}