export function limitPieData(data, max = 5) {
  if (!Array.isArray(data) || data.length <= max) {
    return data || []
  }

  const top = data.slice(0, max)
  const othersSlice = data.slice(max)

  const others = othersSlice.reduce(
    (accumulator, item) => ({
      total_orders: accumulator.total_orders + (item.total_orders || 0),
      total_revenue: accumulator.total_revenue + (item.total_revenue || 0),
    }),
    {
      total_orders: 0,
      total_revenue: 0,
    },
  )

  return [
    ...top,
    {
      payment_type: 'others',
      ...others,
    },
  ]
}

export function buildFunnelTrendData(funnel) {
  const statusOrder = [
    'created',
    'approved',
    'invoiced',
    'processing',
    'shipped',
    'delivered',
  ]

  const totalsByStatus = Object.fromEntries(
    funnel.map((item) => [item.status, item.total]),
  )

  const orderedStatuses = statusOrder.filter((status) => status in totalsByStatus)

  if (!orderedStatuses.length) {
    return []
  }

  let runningTotal = 0
  const maxTotal = orderedStatuses.reduce(
    (sum, status) => sum + (totalsByStatus[status] || 0),
    0,
  )

  return orderedStatuses.map((status) => {
    runningTotal += totalsByStatus[status] || 0
    return {
      label: status,
      progressPct: maxTotal ? Number(((runningTotal / maxTotal) * 100).toFixed(2)) : 0,
    }
  })
}

export function buildKpiSparklineData(funnel) {
  if (!Array.isArray(funnel) || !funnel.length) {
    return []
  }

  return [...funnel]
    .sort((left, right) => right.total - left.total)
    .map((item) => item.total)
}

export function buildFunnelDonutData(funnel, maxSlices = 5) {
  if (!Array.isArray(funnel) || !funnel.length) {
    return []
  }

  const groupedStatuses = ['created', 'approved', 'unavailable']
  const othersTotal = funnel
    .filter((item) => groupedStatuses.includes(item.status))
    .reduce((sum, item) => sum + item.total, 0)

  const mainStatuses = funnel
    .filter((item) => !groupedStatuses.includes(item.status))
    .sort((left, right) => right.total - left.total)

  const maxMainItems = Math.max(maxSlices - 1, 1)
  const trimmedMain = mainStatuses.slice(0, maxMainItems)
  const extraMain = mainStatuses.slice(maxMainItems)
  const extraMainTotal = extraMain.reduce((sum, item) => sum + item.total, 0)
  const totalOthers = othersTotal + extraMainTotal

  if (totalOthers > 0) {
    trimmedMain.push({
      status: 'others',
      total: totalOthers,
    })
  }

  return trimmedMain
}
