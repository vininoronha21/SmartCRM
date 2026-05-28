import { Bar } from 'react-chartjs-2'

import '../charts/registerCharts'
import {
  chartColors,
  getChartBaseOptions,
  getTooltipOptions,
  statusLabels,
} from '../constants/chart'

export function FunnelChart({ data, theme }) {
  const chartData = {
    labels: data.map((item) => statusLabels[item.status] || item.status),
    datasets: [
      {
        label: 'Pedidos',
        data: data.map((item) => item.total),
        backgroundColor: data.map(
          (item) => chartColors[item.status] || chartColors.default,
        ),
        borderRadius: 4,
        borderWidth: 0,
      },
    ],
  }

  const baseOptions = getChartBaseOptions(theme)

  const options = {
    ...baseOptions,
    indexAxis: 'y',
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
    return <p className="empty-state">Sem dados no período selecionado.</p>
  }

  return <Bar data={chartData} options={options} />
}
