import { Bar } from 'react-chartjs-2'

import '../charts/registerCharts'
import {
  getChartBaseOptions,
  getChartPalette,
  getChartPaletteHover,
  getTooltipOptions,
} from '../constants/chart'
import { formatCurrency } from '../utils/formatters'

import { EmptyState } from './DataStates'

export function TopCategoriesBarChart({ data, theme }) {
  if (!data.length) {
    return <EmptyState />
  }

  const palette = getChartPalette(theme)
  const paletteHover = getChartPaletteHover(theme)

  const chartData = {
    labels: data.map((item) => item.category || 'unknown'),
    datasets: [
      {
        label: 'Receita por categoria',
        data: data.map((item) => item.total_revenue),
        backgroundColor: data.map(
          (_item, index) => palette[index % palette.length],
        ),
        hoverBackgroundColor: data.map(
          (_item, index) => paletteHover[index % paletteHover.length],
        ),
        borderRadius: 6,
        borderSkipped: false,
        borderWidth: 0,
      },
    ],
  }

  const baseOptions = getChartBaseOptions(theme)

  const options = {
    ...baseOptions,
    indexAxis: 'y',
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
        beginAtZero: true,
      },
      y: {
        ...baseOptions.scales.y,
      },
    },
  }

  return <Bar data={chartData} options={options} />
}
