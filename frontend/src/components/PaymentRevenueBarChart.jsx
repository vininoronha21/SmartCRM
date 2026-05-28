import { Bar } from 'react-chartjs-2'

import '../charts/registerCharts'
import {
  chartColors,
  getChartBaseOptions,
  getTooltipOptions,
  paymentLabels,
} from '../constants/chart'
import { formatCurrency } from '../utils/formatters'

export function PaymentRevenueBarChart({ data, theme }) {
  if (!data.length) {
    return <p className="empty-state">Sem dados no período selecionado.</p>
  }

  const chartData = {
    labels: data.map(
      (item) => paymentLabels[item.payment_type] || item.payment_type,
    ),
    datasets: [
      {
        label: 'Receita por tipo de pagamento',
        data: data.map((item) => item.total_revenue),
        backgroundColor: data.map(
          (item) => chartColors[item.payment_type] || chartColors.default,
        ),
        borderWidth: 0,
        borderRadius: 4,
      },
    ],
  }

  const baseOptions = getChartBaseOptions(theme)

  const options = {
    ...baseOptions,
    plugins: {
      ...baseOptions.plugins,
      legend: { display: false },
      tooltip: getTooltipOptions(theme, {
        label: (context) => ` ${formatCurrency(context.raw)}`,
      }),
    },
    scales: {
      x: {
        ...baseOptions.scales.x,
      },
      y: {
        ...baseOptions.scales.y,
        beginAtZero: true,
        ticks: {
          ...baseOptions.scales.y.ticks,
          callback: (value) => formatCurrency(value).replace(',00', ''),
        },
      },
    },
  }

  return <Bar data={chartData} options={options} />
}
