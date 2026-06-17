export const chartColors = {
  palette: [
    '#6D3AB2',
    '#8C78B8',
    '#159A74',
    '#E79A24',
    '#D9534F',
    '#B9B3C8',
  ],
  paletteHover: [
    '#51268F',
    '#765FA7',
    '#0D7D5C',
    '#C47B12',
    '#B6403C',
    '#A29BAF',
  ],
  delivered: '#6D3AB2',
  shipped: '#8C78B8',
  processing: '#E79A24',
  canceled: '#D9534F',
  invoiced: '#159A74',
  outros: '#B9B3C8',
  deliveredHover: '#51268F',
  shippedHover: '#765FA7',
  processingHover: '#C47B12',
  canceledHover: '#B6403C',
  invoicedHover: '#0D7D5C',
  darkPalette: [
    '#A783DC',
    '#4DA6FF',
    '#34D399',
    '#F5BC4A',
    '#F47A6E',
    '#665A78',
  ],
  darkPaletteHover: [
    '#C0A5E7',
    '#73B9FF',
    '#5EE6B7',
    '#FFD174',
    '#FF9A91',
    '#81758F',
  ],
  darkDelivered: '#16A36B',
  darkShipped: '#8C78B8',
  darkProcessing: '#D99122',
  darkCanceled: '#DC4F45',
  darkInvoiced: '#34D399',
  darkOutros: '#52525B',
  darkDeliveredHover: '#34D399',
  darkShippedHover: '#A391C8',
  darkProcessingHover: '#F5BC4A',
  darkCanceledHover: '#F47A6E',
  darkInvoicedHover: '#5EE6B7',
}

const statusColorKeys = {
  delivered: 'delivered',
  shipped: 'shipped',
  processing: 'processing',
  canceled: 'canceled',
  invoiced: 'invoiced',
}

export function getChartPalette(theme) {
  return theme === 'dark' ? chartColors.darkPalette : chartColors.palette
}

export function getChartPaletteHover(theme) {
  return theme === 'dark'
    ? chartColors.darkPaletteHover
    : chartColors.paletteHover
}

export function getStatusColor(status, theme) {
  const colorKey = statusColorKeys[status]

  if (!colorKey) {
    return theme === 'dark' ? chartColors.darkOutros : chartColors.outros
  }

  return theme === 'dark'
    ? chartColors[`dark${colorKey[0].toUpperCase()}${colorKey.slice(1)}`]
    : chartColors[colorKey]
}

export function getStatusHoverColor(status, theme) {
  const colorKey = statusColorKeys[status]

  if (!colorKey) {
    return theme === 'dark' ? chartColors.darkOutros : chartColors.outros
  }

  return theme === 'dark'
    ? chartColors[`dark${colorKey[0].toUpperCase()}${colorKey.slice(1)}Hover`]
    : chartColors[`${colorKey}Hover`]
}

export function getLineChartColors(theme) {
  if (theme === 'dark') {
    return {
      border: '#A783DC',
      background: 'rgba(167, 131, 220, 0.18)',
      point: '#A783DC',
      pointHover: '#C0A5E7',
    }
  }

  return {
    border: '#6D3AB2',
    background: 'rgba(109, 58, 178, 0.12)',
    point: '#6D3AB2',
    pointHover: '#51268F',
  }
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
        color: isDark ? '#B4AFC5' : '#6F6E7A',
        font: { family: 'Inter', size: 12 },
      },
      grid: isDark ? { display: false } : { color: '#ECEAF0' },
      border: isDark ? { display: false } : { color: '#ECEAF0' },
    },
    y: {
      ticks: {
        color: isDark ? '#B4AFC5' : '#6F6E7A',
        font: { family: 'Inter', size: 12 },
      },
      grid: isDark ? { display: false } : { color: '#ECEAF0' },
      border: isDark ? { display: false } : { color: '#ECEAF0' },
    },
  }
}

export function getTooltipOptions(theme, callbacks = undefined) {
  const isDark = theme === 'dark'

  return {
    enabled: false,
    external: externalTooltipHandler,
    backgroundColor: isDark ? '#20202B' : '#FFFFFF',
    titleColor: isDark ? '#F0EDF6' : '#1F1F29',
    bodyColor: isDark ? '#B4AFC5' : '#6F6E7A',
    borderColor: isDark ? 'rgba(237,231,246,0.12)' : '#E4E3E8',
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
          color: theme === 'dark' ? '#B4AFC5' : '#6F6E7A',
          boxWidth: 12,
          padding: 16,
        },
      },
      tooltip: getTooltipOptions(theme),
    },
    scales: getChartScales(theme),
  }
}
