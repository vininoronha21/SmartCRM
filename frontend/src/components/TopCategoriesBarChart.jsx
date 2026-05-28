import { Bar } from 'react-chartjs-2'

import '../charts/registerCharts'
import {
  chartColors,
  getChartBaseOptions,
  getTooltipOptions,
} from '../constants/chart'
import { formatCurrency } from '../utils/formatters'

export function TopCategoriesBarChart({ data, theme }) {
  if (!data.length) {
    return <p className="empty-state">Sem dados no período selecionado.</p>
  }

  const chartData = {
    labels: data.map((item) => item.category || 'unknown'),
    datasets: [
      {
        label: 'Receita por categoria',
        data: data.map((item) => item.total_revenue),
        backgroundColor: chartColors.orders,
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
