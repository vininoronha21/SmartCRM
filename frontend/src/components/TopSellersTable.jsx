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
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => (
          <tr key={row.seller_id}>
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
  )
}
