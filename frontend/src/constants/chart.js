export const chartColors = {
  palette: [
    '#0F6F63',
    '#36B89B',
    '#FF7637',
    '#A9D9DF',
    '#E2E2E2',
    '#6F7474',
  ],
  paletteHover: [
    '#095B51',
    '#1FA886',
    '#F15F22',
    '#86CBD4',
    '#CFCFCF',
    '#555B5B',
  ],
  delivered: '#0F6F63',
  shipped: '#36B89B',
  processing: '#FF7637',
  canceled: '#B5361F',
  invoiced: '#A9D9DF',
  outros: '#E2E2E2',
  deliveredHover: '#095B51',
  shippedHover: '#1FA886',
  processingHover: '#F15F22',
  canceledHover: '#962914',
  invoicedHover: '#86CBD4',
  darkPalette: [
    '#2563EB',
    '#DC4F45',
    '#16A36B',
    '#D99122',
    '#7C3AED',
    '#DB2777',
  ],
  darkPaletteHover: [
    '#4A9EF5',
    '#F47A6E',
    '#34D399',
    '#F5BC4A',
    '#A78BFA',
    '#F585CC',
  ],
  darkDelivered: '#16A36B',
  darkShipped: '#2563EB',
  darkProcessing: '#D99122',
  darkCanceled: '#DC4F45',
  darkInvoiced: '#7C3AED',
  darkOutros: '#52525B',
  darkDeliveredHover: '#34D399',
  darkShippedHover: '#4A9EF5',
  darkProcessingHover: '#F5BC4A',
  darkCanceledHover: '#F47A6E',
  darkInvoicedHover: '#A78BFA',
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
      border: '#4A9EF5',
      background: 'rgba(74, 158, 245, 0.2)',
      point: '#4A9EF5',
      pointHover: '#7EB8F7',
    }
  }

  return {
    border: '#8A8F98',
    background: 'rgba(138, 143, 152, 0.14)',
    point: '#8A8F98',
    pointHover: '#5F6670',
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
