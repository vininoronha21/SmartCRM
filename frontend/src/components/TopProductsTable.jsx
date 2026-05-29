import { formatCurrency, formatNumber } from '../utils/formatters'

import { EmptyState } from './DataStates'

export function TopProductsTable({ rows }) {
  if (!rows.length) {
    return <EmptyState message="Sem categorias para o período selecionado." />
  }

  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>Rank</th>
          <th>Categoria</th>
          <th>Pedidos</th>
          <th>Receita</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => (
          <tr key={row.category || `${index}-unknown`}>
            <td>
              <span className="rank-badge">{index + 1}</span>
            </td>
            <td className="table-cell-category">{row.category || 'unknown'}</td>
            <td>{formatNumber(row.total_orders)}</td>
            <td>{formatCurrency(row.total_revenue)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
