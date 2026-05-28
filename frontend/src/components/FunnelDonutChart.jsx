import { Doughnut } from 'react-chartjs-2'

import '../charts/registerCharts'
import {
  chartColors,
  getChartBaseOptions,
  getTooltipOptions,
  statusLabels,
} from '../constants/chart'
import { buildFunnelDonutData } from '../utils/chartData'

const centerTextPlugin = {
  id: 'centerText',
  afterDraw(chart) {
    const { ctx } = chart
    const x = chart.getDatasetMeta(0).data[0]?.x
    const y = chart.getDatasetMeta(0).data[0]?.y

    if (!x || !y) {
      return
    }

    const activePoint = chart.tooltip?.dataPoints?.[0]

    const data = chart.data.datasets[0].data
    const labels = chart.data.labels

    const value = activePoint
      ? data[activePoint.dataIndex]
      : data.reduce((sum, item) => sum + item, 0)

    const label = activePoint ? labels[activePoint.dataIndex] : 'Total'

    const styles = getComputedStyle(document.documentElement)

    ctx.save()
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = styles.getPropertyValue('--color-text-primary').trim()
    ctx.font = '700 20px Inter'
    ctx.fillText(Number(value || 0).toLocaleString('pt-BR'), x, y - 10)

    ctx.fillStyle = styles.getPropertyValue('--color-text-secondary').trim()
    ctx.font = '400 12px Inter'
    ctx.fillText(label, x, y + 14)
    ctx.restore()
  },
}

export function FunnelDonutChart({ data, theme }) {
  const donutData = buildFunnelDonutData(data, 5)

  if (!donutData.length) {
    return <p className="empty-state">Sem dados no período selecionado.</p>
  }

  const chartData = {
    labels: donutData.map((item) => statusLabels[item.status] || item.status),
    datasets: [
      {
        data: donutData.map((item) => item.total),
        backgroundColor: donutData.map(
          (item) => chartColors[item.status] || chartColors.default,
        ),
        borderRadius: 8,
        borderWidth: 0,
      },
    ],
  }

  const baseOptions = getChartBaseOptions(theme)

  const options = {
    ...baseOptions,
    cutout: '62%',
    scales: undefined,
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

  return <Doughnut data={chartData} options={options} plugins={[centerTextPlugin]} />
}
