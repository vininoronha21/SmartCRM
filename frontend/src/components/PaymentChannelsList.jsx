import { paymentLabels } from '../constants/chart'
import { formatPercent } from '../utils/formatters'

import { EmptyState } from './DataStates'

export function PaymentChannelsList({ data }) {
  const totalOrders = data.reduce((sum, item) => sum + item.total_orders, 0)

  if (!data.length || totalOrders <= 0) {
    return <EmptyState message="Sem pagamentos para o período selecionado." />
  }

  return (
    <div className="payment-channel-list" aria-label="Canais de pagamento por pedidos">
      {data.map((item, channelIndex) => {
        const percentage = (item.total_orders / totalOrders) * 100
        return (
          <div className="payment-channel-row" key={item.payment_type} style={{ '--channel-index': channelIndex }}>
            <span>{paymentLabels[item.payment_type] || item.payment_type}</span>
            <div className="payment-channel-track" aria-hidden="true">
              <span style={{ width: `${Math.max(percentage, 2)}%` }} />
            </div>
            <strong>{formatPercent(percentage).replace(',00', '')}</strong>
          </div>
        )
      })}
    </div>
  )
}
