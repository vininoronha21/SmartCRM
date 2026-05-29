import { useMemo, useState } from 'react'

import './App.css'
import { buildAlerts, buildInsights } from './utils/insights'
import { AboutPanel } from './components/AboutPanel'
import { ChartCard } from './components/ChartCard'
import { ErrorState } from './components/DataStates'
import { AlertsBanner } from './components/AlertsBanner'
import { FunnelDonutChart } from './components/FunnelDonutChart'
import { FunnelTrendLineChart } from './components/FunnelTrendLineChart'
import { InsightBox } from './components/InsightBox'
import { MetricCard } from './components/MetricCard'
import { PaymentPieChart } from './components/PaymentPieChart'
import { PaymentRevenueBarChart } from './components/PaymentRevenueBarChart'
import { ReportsPanel } from './components/ReportsPanel'
import { RevenueChart } from './components/RevenueChart'
import { Sidebar } from './components/Sidebar'
import { SkeletonCard, SkeletonChart } from './components/Skeletons'
import { TopCategoriesBarChart } from './components/TopCategoriesBarChart'
import { TopProductsTable } from './components/TopProductsTable'
import { TopSellersTable } from './components/TopSellersTable'
import { Topbar } from './components/Topbar'
import { useDashboardData } from './hooks/useDashboardData'
import { useTheme } from './hooks/useTheme'
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
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isAboutOpen, setIsAboutOpen] = useState(false)
  const [dismissedAlerts, setDismissedAlerts] = useState([])

  const { data, error, lastUpdatedAt, loading, refreshing, reload } =
    useDashboardData(filters)

  const { theme, toggleTheme } = useTheme()

  const totalOrders = data.conversion.total_orders || 0
  const totalRevenue = data.revenue.total_revenue || 0

  const canceledOrders = useMemo(() => {
    const canceled = data.funnel.find((item) => item.status === 'canceled')
    return canceled?.total || 0
  }, [data.funnel])

  const ticketMedio = totalOrders > 0 ? totalRevenue / totalOrders : 0

  const sellersAtivos = useMemo(() => {
    return new Set(data.topSellersExtended.map((item) => item.seller_id)).size
  }, [data.topSellersExtended])

  const categoriaLider = data.topProductsExtended[0]?.category || 'Sem dados'

  const canceledPct = totalOrders > 0 ? (canceledOrders / totalOrders) * 100 : 0

  const alerts = useMemo(
    () =>
      buildAlerts({
        conversionRate: data.conversion.conversion_rate_pct,
        canceledPct,
        ticketMedio,
      }),
    [canceledPct, data.conversion.conversion_rate_pct, ticketMedio],
  )

  const insights = useMemo(
    () =>
      buildInsights(data, {
        conversionRate: data.conversion.conversion_rate_pct,
        canceledPct,
      }),
    [canceledPct, data],
  )

  const filterLabel = formatDateLabel(filters.startDate, filters.endDate)

  const tabTitle = activeTab === 'reports' ? 'Reports' : 'Dashboard'
  const hasLoadError = Boolean(error)

  function handleDismissAlert(alertId) {
    setDismissedAlerts((previousDismissed) => [...previousDismissed, alertId])
  }

  return (
    <div className="app">
      <Sidebar
        activeTab={activeTab}
        isOpen={isSidebarOpen}
        onOpenAbout={() => setIsAboutOpen(true)}
        onSelectTab={setActiveTab}
      />

      <AboutPanel
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />

      <main className={`main-content ${isSidebarOpen ? '' : 'sidebar-collapsed'}`.trim()}>
        <Topbar
          title={tabTitle}
          theme={theme}
          sidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen((current) => !current)}
          onToggleTheme={toggleTheme}
          filters={filters}
          lastUpdatedAt={lastUpdatedAt}
          loading={loading || refreshing}
          onApplyFilters={setFilters}
          onClearFilters={() => setFilters(INITIAL_FILTERS)}
          onRefresh={reload}
        />

        <AlertsBanner
          alerts={alerts}
          dismissedAlerts={dismissedAlerts}
          onDismiss={handleDismissAlert}
        />

        {error ? (
          <section className="error-banner" role="alert">
            {error}
          </section>
        ) : null}

        {activeTab === 'reports' ? (
          <>
            <ReportsPanel data={data} />
            <InsightBox text={insights.portfolio} />
          </>
        ) : (
          <>
            <section className="kpi-grid" aria-live="polite">
              {loading ? (
                Array.from({ length: 7 }, (_item, index) => (
                  <SkeletonCard key={index} />
                ))
              ) : (
                <>
                  <MetricCard
                    label="Receita Total"
                    value={formatCurrency(totalRevenue)}
                    subtitle={filterLabel}
                    tone="revenue"
                  />
                  <MetricCard
                    label="Total de Pedidos"
                    value={formatNumber(totalOrders)}
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
                  <MetricCard
                    label="Ticket Médio"
                    value={formatCurrency(ticketMedio)}
                    subtitle="Receita / pedidos"
                    tone="ticket"
                  />
                  <MetricCard
                    label="Sellers Ativos"
                    value={formatNumber(sellersAtivos)}
                    subtitle="Base top 50"
                    tone="sellers"
                  />
                  <MetricCard
                    label="Categoria Líder"
                    value={categoriaLider}
                    subtitle="Maior receita"
                    tone="leader"
                  />
                </>
              )}
            </section>

            <InsightBox text={insights.overview} />

            <section className="chart-grid">
              {loading ? (
                <SkeletonChart />
              ) : (
                <ChartCard title="Funil de Vendas por Status" size="sm">
                  {hasLoadError ? (
                    <ErrorState onRetry={reload} />
                  ) : (
                    <FunnelDonutChart data={data.funnel} theme={theme} />
                  )}
                </ChartCard>
              )}

              {loading ? (
                <SkeletonChart />
              ) : (
                <ChartCard title="Distribuição de Pagamentos" size="sm">
                  {hasLoadError ? (
                    <ErrorState onRetry={reload} />
                  ) : (
                    <PaymentPieChart data={data.paymentDistribution} theme={theme} />
                  )}
                </ChartCard>
              )}
            </section>

            <section className="chart-grid">
              {loading ? (
                <SkeletonChart />
              ) : (
                <ChartCard title="Top 8 Categorias por Receita" size="sm">
                  {hasLoadError ? (
                    <ErrorState onRetry={reload} />
                  ) : (
                    <TopCategoriesBarChart
                      data={data.topCategoriesByRevenue}
                      theme={theme}
                    />
                  )}
                </ChartCard>
              )}

              {loading ? (
                <SkeletonChart />
              ) : (
                <ChartCard title="Receita por Tipo de Pagamento" size="sm">
                  {hasLoadError ? (
                    <ErrorState onRetry={reload} />
                  ) : (
                    <PaymentRevenueBarChart
                      data={data.paymentDistribution}
                      theme={theme}
                    />
                  )}
                </ChartCard>
              )}
            </section>

            <InsightBox text={insights.commerce} />

            <section className="chart-grid">
              {loading ? (
                <SkeletonChart height={280} />
              ) : (
                <ChartCard title="Receita ao Longo do Tempo" size="lg">
                  {hasLoadError ? (
                    <ErrorState onRetry={reload} />
                  ) : (
                    <RevenueChart data={data.revenueTimeline} theme={theme} />
                  )}
                </ChartCard>
              )}

              {loading ? (
                <SkeletonChart height={280} />
              ) : (
                <ChartCard title="Tendência do Funil (Simulada)" size="lg">
                  {hasLoadError ? (
                    <ErrorState onRetry={reload} />
                  ) : (
                    <FunnelTrendLineChart data={data.funnel} theme={theme} />
                  )}
                </ChartCard>
              )}
            </section>

            <section className="chart-grid">
              {loading ? (
                <SkeletonChart height={320} />
              ) : (
                <ChartCard title="Top 10 Sellers" size="table">
                  {hasLoadError ? (
                    <ErrorState onRetry={reload} />
                  ) : (
                    <TopSellersTable rows={data.topSellers} />
                  )}
                </ChartCard>
              )}

              {loading ? (
                <SkeletonChart height={320} />
              ) : (
                <ChartCard title="Top 10 Categorias" size="table">
                  {hasLoadError ? (
                    <ErrorState onRetry={reload} />
                  ) : (
                    <TopProductsTable rows={data.topProducts} />
                  )}
                </ChartCard>
              )}
            </section>

            <InsightBox text={insights.portfolio} />
          </>
        )}
      </main>
    </div>
  )
}

export default App
