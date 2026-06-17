import { formatCurrency, formatNumber } from '../utils/formatters'

import { EmptyState } from './DataStates'

export function TopSellersTable({ rows }) {
  if (!rows.length) {
    return <EmptyState message="Sem sellers para o período selecionado." />
  }

  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>Rank</th>
          <th>Seller</th>
          <th>Pedidos</th>
          <th>Receita</th>
          <th>Conversão</th>
          <th>Ticket Médio</th>
          <th>Cancelamentos</th>
          <th>Atingimento da Meta</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => {
          const averageTicket =
            row.total_orders > 0 ? row.total_revenue / row.total_orders : 0

          return (
            <tr key={row.seller_id}>
              <td>
                <span className="rank-badge">{index + 1}</span>
              </td>
              <td className="table-cell-id">{row.seller_id}</td>
              <td className="numeric">{formatNumber(row.total_orders)}</td>
              <td className="numeric">{formatCurrency(row.total_revenue)}</td>
              <td className="numeric unavailable">-</td>
              <td className="numeric">{formatCurrency(averageTicket)}</td>
              <td className="numeric unavailable">-</td>
              <td className="numeric">
                <div className="progress-cell unavailable" aria-label="Meta indisponível">
                  <span>-</span>
                  <span className="progress-track">
                    <span className="progress-fill" style={{ width: '0%' }} />
                  </span>
                </div>
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
