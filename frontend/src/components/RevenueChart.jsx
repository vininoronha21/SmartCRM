import { Line } from 'react-chartjs-2'

import '../charts/registerCharts'
import { chartColors, chartDefaults } from '../constants/chart'
import { formatCurrency } from '../utils/formatters'

export function RevenueChart({ data }) {
  const chartData = {
    labels: data.map((item) => item.label),
    datasets: [
      {
        label: 'Receita (R$)',
        data: data.map((item) => item.totalRevenue),
        borderColor: chartColors.revenue,
        backgroundColor: chartColors.revenueArea,
        fill: true,
        tension: 0.28,
        pointRadius: 3,
        pointHoverRadius: 5,
      },
    ],
  }

  const options = {
    ...chartDefaults,
    plugins: {
      ...chartDefaults.plugins,
      legend: { display: false },
      tooltip: {
        ...chartDefaults.plugins.tooltip,
        callbacks: {
          label: (context) => formatCurrency(context.raw),
        },
      },
    },
    scales: {
      x: {
        ...chartDefaults.scales.x,
      },
      y: {
        ...chartDefaults.scales.y,
        beginAtZero: true,
        ticks: {
          ...chartDefaults.scales.y.ticks,
          callback: (value) =>
            formatCurrency(value).replace(',00', '').replace('R$', 'R$ '),
        },
      },
    },
  }

  if (!data.length) {
    return <p className="empty-state">Sem dados no período selecionado.</p>
  }

  return <Line data={chartData} options={options} />
}
