export const chartColors = {
  orders: '#2383E2',
  delivered: '#22C55E',
  shipped: '#3B82F6',
  processing: '#F59E0B',
  canceled: '#EF4444',
  invoiced: '#8B5CF6',
  approved: '#64748B',
  created: '#94A3B8',
  unavailable: '#CBD5E1',
  default: '#9CA3AF',

  credit_card: '#2383E2',
  boleto: '#D9730D',
  voucher: '#9065B0',
  debit_card: '#0F7B6C',
  not_defined: '#9B9A97',
  others: '#787774',

  revenue: '#2563EB',
  revenueArea: 'rgba(37, 99, 235, 0.10)',
}

export const statusLabels = {
  delivered: 'Delivered',
  shipped: 'Shipped',
  processing: 'Processing',
  canceled: 'Canceled',
  invoiced: 'Invoiced',
  approved: 'Approved',
  created: 'Created',
  unavailable: 'Unavailable',
  others: 'Outros',
}

export const paymentLabels = {
  credit_card: 'Cartão de crédito',
  boleto: 'Boleto',
  voucher: 'Voucher',
  debit_card: 'Cartão de débito',
  not_defined: 'Não definido',
  others: 'Outros',
}

function getOrCreateTooltip(chart) {
  const tooltipClass = 'chartjs-custom-tooltip'
  let tooltipElement = chart.canvas.parentNode.querySelector(`.${tooltipClass}`)

  if (!tooltipElement) {
    tooltipElement = document.createElement('div')
    tooltipElement.className = tooltipClass
    tooltipElement.innerHTML = '<div></div>'
    chart.canvas.parentNode.appendChild(tooltipElement)
  }

  return tooltipElement
}

function externalTooltipHandler(context) {
  const { chart, tooltip } = context
  const tooltipElement = getOrCreateTooltip(chart)

  if (tooltip.opacity === 0) {
    tooltipElement.style.opacity = 0
    return
  }

  const titleLines = tooltip.title || []
  const bodyLines = tooltip.body?.map((bodyItem) => bodyItem.lines) || []

  const titleHtml = titleLines
    .map((title) => `<p class="chartjs-tooltip-title">${title}</p>`)
    .join('')

  const bodyHtml = bodyLines
    .map((body) => `<p class="chartjs-tooltip-body">${body}</p>`)
    .join('')

  const wrapper = tooltipElement.querySelector('div')
  wrapper.innerHTML = `${titleHtml}${bodyHtml}`

  const { offsetLeft: positionX, offsetTop: positionY } = chart.canvas

  tooltipElement.style.opacity = 1
  tooltipElement.style.left = `${positionX + tooltip.caretX}px`
  tooltipElement.style.top = `${positionY + tooltip.caretY}px`
}

export function getChartScales(theme) {
  const isDark = theme === 'dark'

  return {
    x: {
      ticks: {
        color: isDark ? '#8B8FA8' : '#787774',
        font: { family: 'Inter', size: 12 },
      },
      grid: isDark ? { display: false } : { color: '#F7F6F3' },
      border: isDark ? { display: false } : { color: '#F7F6F3' },
    },
    y: {
      ticks: {
        color: isDark ? '#8B8FA8' : '#787774',
        font: { family: 'Inter', size: 12 },
      },
      grid: isDark ? { display: false } : { color: '#F7F6F3' },
      border: isDark ? { display: false } : { color: '#F7F6F3' },
    },
  }
}

export function getTooltipOptions(theme, callbacks = undefined) {
  const isDark = theme === 'dark'

  return {
    enabled: false,
    external: externalTooltipHandler,
    backgroundColor: isDark ? '#22263A' : '#FFFFFF',
    titleColor: isDark ? '#E8E9EC' : '#37352F',
    bodyColor: isDark ? '#8B8FA8' : '#787774',
    borderColor: isDark ? 'rgba(255,255,255,0.06)' : '#E3E2E0',
    borderWidth: 1,
    padding: 12,
    cornerRadius: 8,
    displayColors: false,
    titleFont: { family: 'Inter', size: 13, weight: '600' },
    bodyFont: { family: 'Inter', size: 12, weight: '400' },
    callbacks,
  }
}

export function getChartBaseOptions(theme) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          font: { family: 'Inter', size: 12 },
          color: theme === 'dark' ? '#8B8FA8' : '#787774',
          boxWidth: 12,
          padding: 16,
        },
      },
      tooltip: getTooltipOptions(theme),
    },
    scales: getChartScales(theme),
  }
}
