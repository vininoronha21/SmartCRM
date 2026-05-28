const DEFAULT_API_BASE_URL = 'http://localhost:8000/api/v1'

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL
).replace(/\/$/, '')

function buildUrl(path, params = {}) {
  const url = new URL(`${API_BASE_URL}${path}`)

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      return
    }
    url.searchParams.set(key, value)
  })

  return url.toString()
}

async function fetchApi(path, params = {}) {
  const response = await fetch(buildUrl(path, params), {
    headers: {
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`Falha ao buscar ${path}: ${response.status}`)
  }

  const payload = await response.json()

  if (!payload || typeof payload !== 'object' || !('data' in payload)) {
    throw new Error(`Resposta inválida em ${path}`)
  }

  return payload.data
}

function buildDateQuery(filters) {
  return {
    start_date: filters.startDate,
    end_date: filters.endDate,
  }
}

export async function fetchDashboardCore(filters) {
  const dateQuery = buildDateQuery(filters)

  const [funnel, conversion, revenue, topSellers, topProducts, paymentDistribution] =
    await Promise.all([
      fetchApi('/funnel', dateQuery),
      fetchApi('/conversion-rate', dateQuery),
      fetchApi('/revenue', dateQuery),
      fetchApi('/top-sellers', { ...dateQuery, limit: 10 }),
      fetchApi('/top-products', { ...dateQuery, limit: 10 }),
      fetchApi('/payment-distribution'),
    ])

  return {
    funnel,
    conversion,
    revenue,
    topSellers,
    topProducts,
    paymentDistribution,
  }
}

export async function fetchRevenueByRange(startDate, endDate) {
  return fetchApi('/revenue', {
    start_date: startDate,
    end_date: endDate,
  })
}
