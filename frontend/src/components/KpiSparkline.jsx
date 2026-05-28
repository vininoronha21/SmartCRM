import { Line } from 'react-chartjs-2'

import '../charts/registerCharts'

export function KpiSparkline({ values, color }) {
  if (!values.length) {
    return null
  }

  const chartData = {
    labels: values.map((_, index) => index),
    datasets: [
      {
        data: values,
        borderColor: color,
        backgroundColor: 'transparent',
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 0,
        fill: false,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
    scales: {
      x: { display: false },
      y: { display: false },
    },
    elements: {
      point: { radius: 0 },
      line: { tension: 0.4, borderWidth: 2 },
    },
  }

  return (
    <div className="kpi-sparkline" aria-hidden="true">
      <Line data={chartData} options={options} />
    </div>
  )
}
