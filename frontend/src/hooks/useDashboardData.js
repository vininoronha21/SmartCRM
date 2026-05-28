import { useCallback, useEffect, useRef, useState } from 'react'

import { fetchDashboardCore, fetchRevenueByRange } from '../api/dashboardApi'
import { buildRevenueBuckets } from '../utils/dateRanges'

const INITIAL_DATA = {
  funnel: [],
  conversion: {
    total_orders: 0,
    delivered: 0,
    conversion_rate_pct: 0,
  },
  revenue: {
    total_revenue: 0,
  },
  topSellers: [],
  topSellersExtended: [],
  topProducts: [],
  topProductsExtended: [],
  topCategoriesByRevenue: [],
  paymentDistribution: [],
  revenueTimeline: [],
}

async function loadRevenueTimeline(filters) {
  const buckets = buildRevenueBuckets(filters.startDate, filters.endDate, 24)

  if (!buckets.length) {
    return []
  }

  const results = await Promise.all(
    buckets.map(async (bucket) => {
      const revenue = await fetchRevenueByRange(bucket.startDate, bucket.endDate)
      return {
        label: bucket.label,
        totalRevenue: revenue.total_revenue || 0,
      }
    }),
  )

  return results
}

export function useDashboardData(filters) {
  const hasLoadedOnce = useRef(false)
  const [data, setData] = useState(INITIAL_DATA)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')
  const [lastUpdatedAt, setLastUpdatedAt] = useState('')

  const fetchData = useCallback(async () => {
    setError('')

    if (hasLoadedOnce.current) {
      setRefreshing(true)
    } else {
      setLoading(true)
    }

    try {
      const [coreData, revenueTimeline] = await Promise.all([
        fetchDashboardCore(filters),
        loadRevenueTimeline(filters),
      ])

      setData({
        ...coreData,
        revenueTimeline,
      })
      setLastUpdatedAt(new Date().toISOString())
    } catch (err) {
      setError(err.message || 'Erro ao carregar dashboard.')
    } finally {
      hasLoadedOnce.current = true
      setLoading(false)
      setRefreshing(false)
    }
  }, [filters])

  useEffect(() => {
    // This effect is responsible for syncing dashboard state with current filters.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData()
  }, [fetchData])

  return {
    data,
    loading,
    refreshing,
    error,
    lastUpdatedAt,
    reload: fetchData,
  }
}
