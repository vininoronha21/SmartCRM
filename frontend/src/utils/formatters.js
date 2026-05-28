const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const integerFormatter = new Intl.NumberFormat('pt-BR')

const percentFormatter = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'short',
  timeStyle: 'short',
})

export function formatCurrency(value) {
  return currencyFormatter.format(Number(value) || 0)
}

export function formatNumber(value) {
  return integerFormatter.format(Number(value) || 0)
}

export function formatPercent(value) {
  return `${percentFormatter.format(Number(value) || 0)}%`
}

export function formatDateTime(value) {
  if (!value) {
    return '-'
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return '-'
  }

  return dateFormatter.format(date)
}

export function formatDateLabel(startDate, endDate) {
  if (startDate && endDate) {
    return `${startDate} a ${endDate}`
  }

  if (startDate) {
    return `Desde ${startDate}`
  }

  if (endDate) {
    return `Até ${endDate}`
  }

  return 'Período completo'
}
