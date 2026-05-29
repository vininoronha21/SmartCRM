import { Bar } from 'react-chartjs-2'

import '../charts/registerCharts'
import {
  getChartBaseOptions,
  getStatusColor,
  getStatusHoverColor,
  getTooltipOptions,
  statusLabels,
} from '../constants/chart'

import { EmptyState } from './DataStates'

export function FunnelChart({ data, theme }) {
  const chartData = {
    labels: data.map((item) => statusLabels[item.status] || item.status),
    datasets: [
      {
        label: 'Pedidos',
        data: data.map((item) => item.total),
        backgroundColor: data.map((item) => getStatusColor(item.status, theme)),
        hoverBackgroundColor: data.map((item) =>
          getStatusHoverColor(item.status, theme),
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
        label: (context) => ` ${Number(context.raw || 0).toLocaleString('pt-BR')}`,
      }),
    },
    scales: {
      x: {
        ...baseOptions.scales.x,
        beginAtZero: true,
      },
      y: {
        ...baseOptions.scales.y,
        grid: { display: false },
      },
    },
  }

  if (!data.length) {
    return <EmptyState />
  }

  return <Bar data={chartData} options={options} />
}
