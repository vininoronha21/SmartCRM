export const ALERT_THRESHOLDS = {
  conversionRate: { min: 90, message: 'Taxa de conversão abaixo de 90%' },
  canceledPct: { max: 5, message: 'Taxa de cancelamento acima de 5%' },
  ticketMedio: { min: 100, message: 'Ticket médio abaixo de R$100' },
}

export function buildAlerts(metrics) {
  const alerts = []

  if (metrics.conversionRate < ALERT_THRESHOLDS.conversionRate.min) {
    alerts.push({ id: 'conversion-rate', message: ALERT_THRESHOLDS.conversionRate.message })
  }

  if (metrics.canceledPct > ALERT_THRESHOLDS.canceledPct.max) {
    alerts.push({ id: 'canceled-pct', message: ALERT_THRESHOLDS.canceledPct.message })
  }

  if (metrics.ticketMedio < ALERT_THRESHOLDS.ticketMedio.min) {
    alerts.push({ id: 'ticket-medio', message: ALERT_THRESHOLDS.ticketMedio.message })
  }

  return alerts
}

export function buildInsights(data, metrics) {
  const overview = []
  const commerce = []
  const portfolio = []

  if (metrics.conversionRate < 90) {
    overview.push(
      "Taxa de conversão abaixo de 90%. Investigar gargalos no status 'shipped'.",
    )
  }

  if (metrics.canceledPct > 5) {
    overview.push(
      `${metrics.canceledPct.toFixed(2)}% dos pedidos foram cancelados. Verificar causas e padrão de produtos.`,
    )
  }

  const topProduct = data.topProducts?.[0]
  const totalRevenue = data.revenue?.total_revenue || 0
  if (topProduct && totalRevenue > 0) {
    const share = topProduct.total_revenue / totalRevenue
    if (share > 0.15) {
      commerce.push(
        `Categoria '${topProduct.category}' representa mais de 15% da receita. Considerar diversificação.`,
      )
    }
  }

  const creditCard = data.paymentDistribution?.find(
    (item) => item.payment_type === 'credit_card',
  )
  const totalPaymentOrders = data.paymentDistribution?.reduce(
    (sum, item) => sum + item.total_orders,
    0,
  )

  if (creditCard && totalPaymentOrders > 0) {
    const creditCardPct = (creditCard.total_orders / totalPaymentOrders) * 100
    if (creditCardPct > 70) {
      portfolio.push(
        'Mais de 70% dos pagamentos via cartão de crédito. Avaliar incentivo para boleto/débito.',
      )
    }
  }

  return {
    overview: overview[0] || 'Conversão e cancelamento estão dentro dos limites monitorados.',
    commerce: commerce[0] || 'Receita distribuída sem concentração crítica em uma única categoria.',
    portfolio: portfolio[0] || 'Mix de pagamento está equilibrado para o cenário atual.',
  }
}
