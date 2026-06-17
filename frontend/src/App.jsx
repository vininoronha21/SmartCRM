import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import {
  PackageCheck,
  Tag,
  TicketPercent,
  UsersRound,
  XCircle,
} from 'lucide-react'
import { gsap } from 'gsap'

import './App.css'
import { buildAlerts, buildInsights } from './utils/insights'
import { AboutPanel } from './components/AboutPanel'
import { ChartCard } from './components/ChartCard'
import { ErrorState } from './components/DataStates'
import { AlertsBanner } from './components/AlertsBanner'
import { FunnelDonutChart } from './components/FunnelDonutChart'
import { InsightBox } from './components/InsightBox'
import { LoginPage } from './components/LoginPage'
import { MetricCard } from './components/MetricCard'
import { OperationsPanel } from './components/OperationsPanel'
import { PaymentChannelsList } from './components/PaymentChannelsList'
import { PaymentPieChart } from './components/PaymentPieChart'
import { ReportsPanel } from './components/ReportsPanel'
import { RevenueChart } from './components/RevenueChart'
import { Sidebar } from './components/Sidebar'
import { SkeletonCard, SkeletonChart } from './components/Skeletons'
import { TopCategoriesBarChart } from './components/TopCategoriesBarChart'
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

function navigateWithViewTransition(updateRoute) {
  if (document.startViewTransition) {
    document.startViewTransition(updateRoute)
    return
  }

  updateRoute()
}

function DashboardPage({ onLogout, username }) {
  const dashboardRef = useRef(null)
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
  const categoriaLiderReceita = data.topProductsExtended[0]?.total_revenue || 0

  const canceledPct = totalOrders > 0 ? (canceledOrders / totalOrders) * 100 : 0
  const sparklineRevenue = data.revenueTimeline.map((item) => item.totalRevenue)
  const sparklineConversion = Array.from(
    { length: Math.max(sparklineRevenue.length, 2) },
    () => data.conversion.conversion_rate_pct,
  )

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

  useLayoutEffect(() => {
    const root = dashboardRef.current

    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl.from('[data-animate="sidebar"]', { x: -40, opacity: 0, duration: 0.6, clearProps: 'all' })
        .from('[data-animate="dashboard-header"]', { y: -20, opacity: 0, duration: 0.5 }, '-=0.4')
        .from('[data-animate="primary-kpi"] > *', {
          y: 30,
          opacity: 0,
          stagger: 0.1,
          duration: 0.6,
          ease: 'back.out(1.2)'
        }, '-=0.3')
        .from('[data-animate="secondary-kpi"] > *', {
          scale: 0.9,
          opacity: 0,
          stagger: 0.05,
          duration: 0.5
        }, '-=0.4')
        .from('[data-animate="dashboard-panel"]', {
          y: 40,
          opacity: 0,
          stagger: 0.08,
          duration: 0.7
        }, '-=0.3')
        .from('[data-animate="insights-panel"]', { x: 40, opacity: 0, duration: 0.6 }, '-=0.5')
        .from('[data-animate="seller-table"]', { y: 20, opacity: 0, scale: 0.98, duration: 0.45 }, '-=0.2')

      gsap.from('.kpi-card-value', { opacity: 0, y: 15, stagger: 0.05, duration: 0.5, delay: 0.5 })
      gsap.from('.kpi-sparkline', { opacity: 0, scaleX: 0, transformOrigin: 'left', duration: 0.8, delay: 0.7 })
      gsap.from('.ops-item', { opacity: 0, x: 16, stagger: 0.08, duration: 0.4, delay: 0.9 })
      gsap.from('.alert-row', { opacity: 0, x: 20, stagger: 0.1, duration: 0.4, delay: 1.0 })
    }, root)

    return () => ctx.revert()
  }, [])

  function handleDismissAlert(alertId) {
    setDismissedAlerts((previousDismissed) => [...previousDismissed, alertId])
  }

  return (
    <div className="app" ref={dashboardRef} data-route-view="dashboard">
      <Sidebar
        activeTab={activeTab}
        isOpen={isSidebarOpen}
        onOpenAbout={() => setIsAboutOpen(true)}
        onSelectTab={setActiveTab}
        username={username}
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
          onLogout={onLogout}
          onRefresh={reload}
          username={username}
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
            <div className="dashboard-shell">
              <div className="dashboard-workspace">
                <section className="primary-kpi-grid" aria-live="polite" data-animate="primary-kpi">
                  {loading ? (
                    Array.from({ length: 2 }, (_item, index) => (
                      <SkeletonCard key={index} />
                    ))
                  ) : (
                    <>
                      <MetricCard
                        index={0}
                        label="Receita Total"
                        value={formatCurrency(totalRevenue)}
                        subtitle={filterLabel}
                        tone="revenue"
                        size="primary"
                        sparklineValues={sparklineRevenue}
                      />
                      <MetricCard
                        index={1}
                        label="Taxa de Conversão"
                        value={formatPercent(data.conversion.conversion_rate_pct)}
                        subtitle={`${formatNumber(data.conversion.delivered)} pedidos entregues`}
                        tone="conversion"
                        size="primary"
                        sparklineValues={sparklineConversion}
                      />
                    </>
                  )}
                </section>

                <section className="secondary-kpi-grid" aria-live="polite" data-animate="secondary-kpi">
              {loading ? (
                Array.from({ length: 5 }, (_item, index) => (
                  <SkeletonCard key={index} />
                ))
              ) : (
                <>
                  <MetricCard
                    index={2}
                    label="Total de Pedidos"
                    value={formatNumber(totalOrders)}
                    subtitle={filterLabel}
                    tone="orders"
                    icon={PackageCheck}
                  />
                  <MetricCard
                    index={3}
                    label="Ticket Médio"
                    value={formatCurrency(ticketMedio)}
                    subtitle="Receita / pedidos"
                    tone="ticket"
                    icon={TicketPercent}
                  />
                  <MetricCard
                    index={4}
                    label="Sellers Ativos"
                    value={formatNumber(sellersAtivos)}
                    subtitle="Base top 50"
                    tone="sellers"
                    icon={UsersRound}
                  />
                  <MetricCard
                    index={5}
                    label="Cancelamentos"
                    value={formatNumber(canceledOrders)}
                    subtitle={`${formatPercent(canceledPct)} dos pedidos`}
                    tone="canceled"
                    icon={XCircle}
                  />
                  <MetricCard
                    index={6}
                    label="Categoria Líder"
                    value={categoriaLider}
                    subtitle={`${formatCurrency(categoriaLiderReceita)} · ${filterLabel}`}
                    tone="leader"
                    icon={Tag}
                  />
                </>
              )}
            </section>

                <section className="analytics-grid">
                  {loading ? (
                    <SkeletonChart height={280} dataAnimate="dashboard-panel" />
                  ) : (
                    <ChartCard
                      title="Receita ao longo do tempo"
                      size="lg"
                      className="span-7"
                      dataAnimate="dashboard-panel"
                      action={<button type="button" className="chart-select">Diário</button>}
                    >
                      {hasLoadError ? (
                        <ErrorState onRetry={reload} />
                      ) : (
                        <RevenueChart data={data.revenueTimeline} theme={theme} />
                      )}
                    </ChartCard>
                  )}

                  {loading ? (
                    <SkeletonChart dataAnimate="dashboard-panel" />
                  ) : (
                    <ChartCard
                      title="Top 8 categorias por receita"
                      size="lg"
                      className="span-5"
                      dataAnimate="dashboard-panel"
                      action={<button type="button" className="chart-select">Receita</button>}
                    >
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
                    <SkeletonChart dataAnimate="dashboard-panel" />
                  ) : (
                    <ChartCard title="Funil de vendas por status" size="sm" className="span-4" dataAnimate="dashboard-panel">
                      {hasLoadError ? (
                        <ErrorState onRetry={reload} />
                      ) : (
                        <FunnelDonutChart data={data.funnel} theme={theme} />
                      )}
                    </ChartCard>
                  )}

                  {loading ? (
                    <SkeletonChart dataAnimate="dashboard-panel" />
                  ) : (
                    <ChartCard title="Distribuição de pagamentos" size="sm" className="span-4" dataAnimate="dashboard-panel">
                      {hasLoadError ? (
                        <ErrorState onRetry={reload} />
                      ) : (
                        <PaymentPieChart data={data.paymentDistribution} theme={theme} />
                      )}
                    </ChartCard>
                  )}

                  {loading ? (
                    <SkeletonChart dataAnimate="dashboard-panel" />
                  ) : (
                    <ChartCard title="Canais de pagamento" size="sm" className="span-4" dataAnimate="dashboard-panel">
                      {hasLoadError ? (
                        <ErrorState onRetry={reload} />
                      ) : (
                        <PaymentChannelsList data={data.paymentDistribution} />
                      )}
                    </ChartCard>
                  )}

                  {loading ? (
                    <SkeletonChart height={320} dataAnimate="seller-table" />
                  ) : (
                    <ChartCard
                      title="Top sellers por receita"
                      size="table"
                      className="span-12"
                      dataAnimate="seller-table"
                    >
                      {hasLoadError ? (
                        <ErrorState onRetry={reload} />
                      ) : (
                        <TopSellersTable rows={data.topSellers} />
                      )}
                    </ChartCard>
                  )}
                </section>
              </div>

              <OperationsPanel
                canceledOrders={canceledOrders}
                canceledPct={canceledPct}
                category={categoriaLider}
                deliveredOrders={data.conversion.delivered}
                revenue={totalRevenue}
                target={0}
              />
            </div>
          </>
        )}
      </main>
    </div>
  )
}

function App() {
  const [route, setRoute] = useState('login')
  const [username, setUsername] = useState('')

  function handleLogin(username) {
    navigateWithViewTransition(() => {
      setUsername(username)
      setRoute('dashboard')
    })
  }

  function handleLogout() {
    const updateRoute = () => {
      setRoute('login')
      setUsername('')
    }

    if (document.startViewTransition) {
      navigateWithViewTransition(updateRoute)
      return
    }

    document.querySelector('[data-route-view="dashboard"]')?.classList.add('route-exiting')
    window.setTimeout(updateRoute, 170)
  }

  if (route === 'login') {
    return <LoginPage onLogin={handleLogin} />
  }

  return <DashboardPage onLogout={handleLogout} username={username} />
}

export default App
