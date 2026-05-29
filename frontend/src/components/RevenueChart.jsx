import { Line } from 'react-chartjs-2'

import '../charts/registerCharts'
import {
  getChartBaseOptions,
  getLineChartColors,
  getTooltipOptions,
} from '../constants/chart'
import { formatCurrency } from '../utils/formatters'

import { EmptyState } from './DataStates'

export function RevenueChart({ data, theme }) {
  const lineColors = getLineChartColors(theme)

  const chartData = {
    labels: data.map((item) => item.label),
    datasets: [
      {
        label: 'Receita (R$)',
        data: data.map((item) => item.totalRevenue),
        borderColor: lineColors.border,
        backgroundColor: lineColors.background,
        pointBackgroundColor: lineColors.point,
        pointHoverBackgroundColor: lineColors.pointHover,
        fill: true,
        tension: 0.28,
        pointRadius: 3,
        pointHoverRadius: 5,
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
          callback: (value) =>
            formatCurrency(value).replace(',00', '').replace('R$', 'R$ '),
        },
      },
    },
  }

  if (!data.length) {
    return <EmptyState />
  }

  return <Line data={chartData} options={options} />
}
