import { formatCurrency, formatNumber, formatPercent } from '../utils/formatters'
import { paymentLabels } from '../constants/chart'

import { EmptyState } from './DataStates'

function TopSellersByState({ rows }) {
  return (
    <section className="report-block">
      <header>
        <h2 className="report-title">Top Sellers por Estado</h2>
        <p className="report-description">
          Ranking por receita. Dados sem geolocalização disponível para inferir estado.
        </p>
      </header>

      {!rows.length ? (
        <EmptyState message="Sem sellers para o período selecionado." />
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Seller</th>
              <th>Pedidos</th>
              <th>Receita</th>
            </tr>
          </thead>
          <tbody>
            {rows.slice(0, 10).map((row, index) => (
              <tr key={`report-seller-${row.seller_id}`}>
                <td>
                  <span className="rank-badge">{index + 1}</span>
                </td>
                <td className="table-cell-id">{row.seller_id}</td>
                <td>{formatNumber(row.total_orders)}</td>
                <td>{formatCurrency(row.total_revenue)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  )
}

function ProductsByCategory({ rows, totalRevenue }) {
  return (
    <section className="report-block">
      <header>
        <h2 className="report-title">Produtos por Categoria</h2>
        <p className="report-description">
          Top 20 categorias com participação percentual na receita consolidada.
        </p>
      </header>

      {!rows.length ? (
        <EmptyState message="Sem categorias para o período selecionado." />
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Categoria</th>
              <th>Receita</th>
              <th>Share</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const share = totalRevenue > 0 ? (row.total_revenue / totalRevenue) * 100 : 0

              return (
                <tr key={`report-category-${row.category}`}>
                  <td className="table-cell-category">{row.category || 'unknown'}</td>
                  <td>{formatCurrency(row.total_revenue)}</td>
                  <td>
                    <div className="progress-cell">
                      <div className="progress-track">
                        <div
                          className="progress-fill"
                          style={{ width: `${Math.min(share, 100)}%` }}
                        />
                      </div>
                      <span>{formatPercent(share)}</span>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
    </section>
  )
}

function PaymentBreakdown({ rows }) {
  return (
    <section className="report-block">
      <header>
        <h2 className="report-title">Distribuição de Pagamentos</h2>
        <p className="report-description">
          Breakdown por tipo com ticket médio de pagamento em cada categoria.
        </p>
      </header>

      {!rows.length ? (
        <EmptyState message="Sem dados de pagamento no período selecionado." />
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Pedidos</th>
              <th>Receita</th>
              <th>Valor médio</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const averageValue = row.total_orders > 0 ? row.total_revenue / row.total_orders : 0

              return (
                <tr key={`report-payment-${row.payment_type}`}>
                  <td>{paymentLabels[row.payment_type] || row.payment_type}</td>
                  <td>{formatNumber(row.total_orders)}</td>
                  <td>{formatCurrency(row.total_revenue)}</td>
                  <td>{formatCurrency(averageValue)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
    </section>
  )
}

export function ReportsPanel({ data }) {
  return (
    <section className="reports-panel">
      <TopSellersByState rows={data.topSellersExtended} />
      <ProductsByCategory
        rows={data.topProductsExtended}
        totalRevenue={data.revenue.total_revenue}
      />
      <PaymentBreakdown rows={data.paymentDistribution} />
    </section>
  )
}
