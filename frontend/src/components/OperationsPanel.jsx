import {
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  TrendingUp,
} from 'lucide-react'

import { formatCurrency, formatNumber, formatPercent } from '../utils/formatters'

function PanelSection({ children, title, badge }) {
  return (
    <section className="ops-card">
      <div className="ops-card-header">
        <h2>{title}</h2>
        {badge ? <span className="ops-badge">{badge}</span> : null}
      </div>
      {children}
    </section>
  )
}

function InsightItem({ icon: Icon, tone, title, text }) {
  return (
    <article className="ops-item">
      <span className={`ops-icon tone-${tone}`} aria-hidden="true">
        <Icon size={15} strokeWidth={2} />
      </span>
      <div>
        <h3>{title}</h3>
        <p>{text}</p>
      </div>
    </article>
  )
}

function AlertItem({ tone, title, text }) {
  return (
    <button type="button" className="alert-row">
      <span className={`alert-row-dot tone-${tone}`} aria-hidden="true" />
      <span>
        <strong>{title}</strong>
        <small>{text}</small>
      </span>
      <ChevronRight size={15} strokeWidth={2} aria-hidden="true" />
    </button>
  )
}

export function OperationsPanel({
  canceledOrders,
  canceledPct,
  category,
  deliveredOrders,
  revenue,
  target,
}) {
  const hasTarget = Number(target) > 0
  const targetAchievement = hasTarget ? (revenue / target) * 100 : 0

  return (
    <aside
      className="operations-panel"
      aria-label="Insights operacionais"
      data-animate="insights-panel"
    >
      <PanelSection title="Insights e recomendações">
        <InsightItem
          icon={CheckCircle2}
          tone="positive"
          title="Excelente taxa de conversão"
          text="Sua taxa de conversão está acima da média. Continue investindo nas campanhas que geram tráfego qualificado."
        />
        <InsightItem
          icon={AlertTriangle}
          tone="warning"
          title="Atenção aos cancelamentos"
          text={`Cancelamentos representam ${formatPercent(canceledPct)} dos pedidos no período. Revise motivos e ações do time.`}
        />
        <InsightItem
          icon={TrendingUp}
          tone="positive"
          title="Categoria em crescimento"
          text={`A categoria ${category} lidera a receita. Considere ampliar estoque e campanhas.`}
        />
        <button type="button" className="btn-secondary ops-action">
          Ver todos os insights
        </button>
      </PanelSection>

      <PanelSection title="Alertas" badge="3">
        <AlertItem
          tone="error"
          title="Cancelamentos acima do esperado"
          text={`${formatNumber(canceledOrders)} pedidos cancelados (${formatPercent(canceledPct)})`}
        />
        <AlertItem
          tone="error"
          title="Queda na receita em 2 dias"
          text="Monitore os últimos pontos da série de receita."
        />
        <AlertItem
          tone="warning"
          title="Dependência de cartão de crédito"
          text="Revise concentração dos meios de pagamento."
        />
      </PanelSection>

      <PanelSection title="Resumo executivo">
        <dl className="summary-list">
          <div>
            <dt>Receita do período</dt>
            <dd>{formatCurrency(revenue)}</dd>
          </div>
          <div>
            <dt>Meta do período</dt>
            <dd>{hasTarget ? formatCurrency(target) : '-'}</dd>
          </div>
          <div>
            <dt>Atingimento</dt>
            <dd className={hasTarget ? 'summary-positive' : ''}>
              {hasTarget ? formatPercent(targetAchievement) : '-'}
            </dd>
          </div>
          <div>
            <dt>Pedidos entregues</dt>
            <dd>{formatNumber(deliveredOrders)}</dd>
          </div>
        </dl>
        <button type="button" className="btn-secondary ops-action">
          <Sparkles size={14} aria-hidden="true" />
          Ver relatório completo
        </button>
      </PanelSection>
    </aside>
  )
}
