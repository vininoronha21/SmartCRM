const MONTH_LABEL_FORMATTER = new Intl.DateTimeFormat('pt-BR', {
  month: 'short',
  year: '2-digit',
  timeZone: 'UTC',
})

const DEFAULT_REVENUE_START =
  import.meta.env.VITE_REVENUE_TIMELINE_START || '2017-01-01'
const DEFAULT_REVENUE_END =
  import.meta.env.VITE_REVENUE_TIMELINE_END || '2018-12-31'

function parseISODate(value) {
  if (!value) {
    return null
  }

  const [year, month, day] = value.split('-').map(Number)
  if (!year || !month || !day) {
    return null
  }

  const date = new Date(Date.UTC(year, month - 1, day))
  const isValid =
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day

  return isValid ? date : null
}

function formatISODate(date) {
  const year = date.getUTCFullYear()
  const month = `${date.getUTCMonth() + 1}`.padStart(2, '0')
  const day = `${date.getUTCDate()}`.padStart(2, '0')

  return `${year}-${month}-${day}`
}

function startOfMonth(date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1))
}

function endOfMonth(date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0))
}

function addMonths(date, months) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + months, 1))
}

function minDate(a, b) {
  return a.getTime() <= b.getTime() ? a : b
}

function maxDate(a, b) {
  return a.getTime() >= b.getTime() ? a : b
}

function getTodayUTC() {
  const now = new Date()
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
}

export function buildRevenueBuckets(startDateValue, endDateValue, maxBuckets = 24) {
  let startDate = parseISODate(startDateValue)
  let endDate = parseISODate(endDateValue)

  if (!startDate && !endDate) {
    const fallbackStart = parseISODate(DEFAULT_REVENUE_START)
    const fallbackEnd = parseISODate(DEFAULT_REVENUE_END)

    if (fallbackStart && fallbackEnd && fallbackStart <= fallbackEnd) {
      startDate = fallbackStart
      endDate = fallbackEnd
    } else {
      endDate = getTodayUTC()
      startDate = startOfMonth(addMonths(endDate, -5))
    }
  } else if (startDate && !endDate) {
    endDate = getTodayUTC()
  } else if (!startDate && endDate) {
    startDate = startOfMonth(addMonths(endDate, -5))
  }

  if (!startDate || !endDate || startDate > endDate) {
    return []
  }

  const buckets = []
  let cursor = startOfMonth(startDate)

  while (cursor <= endDate && buckets.length < maxBuckets) {
    const monthStart = startOfMonth(cursor)
    const monthEnd = endOfMonth(cursor)
    const rangeStart = maxDate(monthStart, startDate)
    const rangeEnd = minDate(monthEnd, endDate)

    buckets.push({
      label: MONTH_LABEL_FORMATTER.format(rangeStart),
      startDate: formatISODate(rangeStart),
      endDate: formatISODate(rangeEnd),
    })

    cursor = addMonths(cursor, 1)
  }

  return buckets
}
