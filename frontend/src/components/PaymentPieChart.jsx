import { Pie } from 'react-chartjs-2'

import '../charts/registerCharts'
import { chartColors, chartDefaults, paymentLabels } from '../constants/chart'

export function PaymentPieChart({ data }) {
  const chartData = {
    labels: data.map(
      (item) => paymentLabels[item.payment_type] || item.payment_type,
    ),
    datasets: [
      {
        label: 'Pedidos',
        data: data.map((item) => item.total_orders),
        backgroundColor: data.map(
          (item) => chartColors[item.payment_type] || chartColors.not_defined,
        ),
        borderWidth: 0,
      },
    ],
  }

  const options = {
    ...chartDefaults,
    scales: undefined,
    plugins: {
      ...chartDefaults.plugins,
      legend: {
        ...chartDefaults.plugins.legend,
        position: 'bottom',
      },
    },
  }

  if (!data.length) {
    return <p className="empty-state">Sem dados no período selecionado.</p>
  }

  return <Pie data={chartData} options={options} />
}
