import { Line } from 'react-chartjs-2'

import '../charts/registerCharts'
import {
  getChartBaseOptions,
  getLineChartColors,
  getTooltipOptions,
  statusLabels,
} from '../constants/chart'
import { buildFunnelTrendData } from '../utils/chartData'

import { EmptyState } from './DataStates'

export function FunnelTrendLineChart({ data, theme }) {
  const trendData = buildFunnelTrendData(data)

  if (!trendData.length) {
    return <EmptyState />
  }

  const lineColors = getLineChartColors(theme)

  const chartData = {
    labels: trendData.map((item) => statusLabels[item.label] || item.label),
    datasets: [
      {
        label: 'Progresso do funil (%)',
        data: trendData.map((item) => item.progressPct),
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
        label: (context) => ` ${context.raw}%`,
      }),
    },
    scales: {
      x: {
        ...baseOptions.scales.x,
      },
      y: {
        ...baseOptions.scales.y,
        beginAtZero: true,
        max: 100,
        ticks: {
          ...baseOptions.scales.y.ticks,
          callback: (value) => `${value}%`,
        },
      },
    },
  }

  return <Line data={chartData} options={options} />
}
