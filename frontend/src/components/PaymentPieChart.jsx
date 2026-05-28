import { Pie } from 'react-chartjs-2'

import '../charts/registerCharts'
import {
  chartColors,
  getChartBaseOptions,
  getTooltipOptions,
  paymentLabels,
} from '../constants/chart'
import { limitPieData } from '../utils/chartData'

export function PaymentPieChart({ data, theme }) {
  const limitedData = limitPieData(data, 5)

  const chartData = {
    labels: limitedData.map(
      (item) => paymentLabels[item.payment_type] || item.payment_type,
    ),
    datasets: [
      {
        label: 'Pedidos',
        data: limitedData.map((item) => item.total_orders),
        backgroundColor: limitedData.map(
          (item) => chartColors[item.payment_type] || chartColors.others,
        ),
        borderWidth: 0,
        borderRadius: 8,
      },
    ],
  }

  const baseOptions = getChartBaseOptions(theme)

  const options = {
    ...baseOptions,
    scales: undefined,
    plugins: {
      ...baseOptions.plugins,
      legend: {
        ...baseOptions.plugins.legend,
        position: 'bottom',
      },
      tooltip: getTooltipOptions(theme, {
        label: (context) => ` ${Number(context.raw || 0).toLocaleString('pt-BR')}`,
      }),
    },
  }

  if (!data.length) {
    return <p className="empty-state">Sem dados no período selecionado.</p>
  }

  return <Pie data={chartData} options={options} />
}
