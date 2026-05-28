import { useMemo, useState } from 'react'

import './App.css'
import { ChartCard } from './components/ChartCard'
import { FunnelChart } from './components/FunnelChart'
import { MetricCard } from './components/MetricCard'
import { PaymentPieChart } from './components/PaymentPieChart'
import { RevenueChart } from './components/RevenueChart'
import { Sidebar } from './components/Sidebar'
import { TopProductsTable } from './components/TopProductsTable'
import { TopSellersTable } from './components/TopSellersTable'
import { Topbar } from './components/Topbar'
import { useDashboardData } from './hooks/useDashboardData'
import {
  formatCurrency,
  formatDateLabel,
  formatNumber,
  formatPercent,
} from './utils/formatters'

const INITIAL_FILTERS = {
  startDate: '',
  endDate: '',
}

function App() {
  const [filters, setFilters] = useState(INITIAL_FILTERS)
  const { data, error, lastUpdatedAt, loading, refreshing, reload } =
    useDashboardData(filters)

  const canceledOrders = useMemo(() => {
    const canceled = data.funnel.find((item) => item.status === 'canceled')
    return canceled?.total || 0
  }, [data.funnel])

  const filterLabel = formatDateLabel(filters.startDate, filters.endDate)

  return (
    <div className="app">
      <Sidebar />

      <main className="main-content">
        <Topbar
          filters={filters}
          lastUpdatedAt={lastUpdatedAt}
          loading={loading || refreshing}
          onApplyFilters={setFilters}
          onClearFilters={() => setFilters(INITIAL_FILTERS)}
          onRefresh={reload}
        />

        {error ? (
          <section className="error-banner" role="alert">
            {error}
          </section>
        ) : null}

        <section className="kpi-grid" aria-live="polite">
          <MetricCard
            label="Receita Total"
            value={formatCurrency(data.revenue.total_revenue)}
            subtitle={filterLabel}
            tone="revenue"
          />
          <MetricCard
            label="Total de Pedidos"
            value={formatNumber(data.conversion.total_orders)}
            subtitle={filterLabel}
            tone="orders"
          />
          <MetricCard
            label="Taxa de Conversão"
            value={formatPercent(data.conversion.conversion_rate_pct)}
            subtitle={`${formatNumber(data.conversion.delivered)} pedidos entregues`}
            tone="conversion"
          />
          <MetricCard
            label="Pedidos Cancelados"
            value={formatNumber(canceledOrders)}
            subtitle={filterLabel}
            tone="canceled"
          />
        </section>

        <section className="chart-grid">
          <ChartCard title="Funil de Vendas por Status" size="sm">
            <FunnelChart data={data.funnel} />
          </ChartCard>

          <ChartCard title="Distribuição de Pagamentos" size="sm">
            <PaymentPieChart data={data.paymentDistribution} />
          </ChartCard>
        </section>

        <ChartCard title="Receita ao Longo do Tempo" size="lg">
          <RevenueChart data={data.revenueTimeline} />
        </ChartCard>

        <section className="chart-grid">
          <ChartCard title="Top 10 Sellers" size="table">
            <TopSellersTable rows={data.topSellers} />
          </ChartCard>

          <ChartCard title="Top 10 Categorias" size="table">
            <TopProductsTable rows={data.topProducts} />
          </ChartCard>
        </section>
      </main>
    </div>
  )
}

export default App
