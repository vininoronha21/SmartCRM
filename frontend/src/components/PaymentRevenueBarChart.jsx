import { Bar } from 'react-chartjs-2'

import '../charts/registerCharts'
import {
  getChartBaseOptions,
  getChartPalette,
  getChartPaletteHover,
  getTooltipOptions,
  paymentLabels,
} from '../constants/chart'
import { formatCurrency } from '../utils/formatters'

import { EmptyState } from './DataStates'

export function PaymentRevenueBarChart({ data, theme }) {
  if (!data.length) {
    return <EmptyState />
  }

  const palette = getChartPalette(theme)
  const paletteHover = getChartPaletteHover(theme)

  const chartData = {
    labels: data.map(
      (item) => paymentLabels[item.payment_type] || item.payment_type,
    ),
    datasets: [
      {
        label: 'Receita por tipo de pagamento',
        data: data.map((item) => item.total_revenue),
        backgroundColor: data.map(
          (_item, index) => palette[index % palette.length],
        ),
        hoverBackgroundColor: data.map(
          (_item, index) => paletteHover[index % paletteHover.length],
        ),
        borderWidth: 0,
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  }

  const baseOptions = getChartBaseOptions(theme)

  const options = {
    ...baseOptions,
    animation: {
      duration: 600,
      easing: 'easeOutQuart',
      delay: (context) => context.dataIndex * 60,
    },
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
