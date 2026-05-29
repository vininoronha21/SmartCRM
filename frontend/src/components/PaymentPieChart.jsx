import { Pie } from 'react-chartjs-2'

import '../charts/registerCharts'
import {
  getChartBaseOptions,
  getChartPalette,
  getChartPaletteHover,
  getTooltipOptions,
  paymentLabels,
} from '../constants/chart'
import { limitPieData } from '../utils/chartData'

import { EmptyState } from './DataStates'

export function PaymentPieChart({ data, theme }) {
  const limitedData = limitPieData(data, 5)
  const palette = getChartPalette(theme)
  const paletteHover = getChartPaletteHover(theme)

  const chartData = {
    labels: limitedData.map(
      (item) => paymentLabels[item.payment_type] || item.payment_type,
    ),
    datasets: [
      {
        label: 'Pedidos',
        data: limitedData.map((item) => item.total_orders),
        backgroundColor: limitedData.map(
          (_item, index) => palette[index % palette.length],
        ),
        hoverBackgroundColor: limitedData.map(
          (_item, index) => paletteHover[index % paletteHover.length],
        ),
        borderWidth: 0,
        hoverOffset: 22,
        borderRadius: 8,
      },
    ],
  }

  const baseOptions = getChartBaseOptions(theme)

  const options = {
    ...baseOptions,
    scales: undefined,
    hover: { mode: 'nearest' },
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 500,
      easing: 'easeOutQuart',
    },
    transitions: {
      active: {
        animation: {
          duration: 260,
          easing: 'easeOutBack',
        },
      },
    },
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
    return <EmptyState />
  }

  return <Pie data={chartData} options={options} />
}
