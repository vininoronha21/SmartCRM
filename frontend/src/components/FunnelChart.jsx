import { Bar } from 'react-chartjs-2'

import '../charts/registerCharts'
import { chartColors, chartDefaults, statusLabels } from '../constants/chart'

export function FunnelChart({ data }) {
  const chartData = {
    labels: data.map((item) => statusLabels[item.status] || item.status),
    datasets: [
      {
        label: 'Pedidos',
        data: data.map((item) => item.total),
        backgroundColor: data.map(
          (item) => chartColors[item.status] || chartColors.default,
        ),
        borderRadius: 6,
      },
    ],
  }

  const options = {
    ...chartDefaults,
    indexAxis: 'y',
    plugins: {
      ...chartDefaults.plugins,
      legend: { display: false },
    },
    scales: {
      x: {
        ...chartDefaults.scales.x,
        beginAtZero: true,
      },
      y: {
        ...chartDefaults.scales.y,
        grid: { display: false },
      },
    },
  }

  if (!data.length) {
    return <p className="empty-state">Sem dados no período selecionado.</p>
  }

  return <Bar data={chartData} options={options} />
}
