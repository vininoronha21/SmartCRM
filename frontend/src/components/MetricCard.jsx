import { Info } from 'lucide-react'

import { KpiSparkline } from './KpiSparkline'

export function MetricCard({
  change,
  icon: Icon,
  label,
  size = 'secondary',
  sparklineValues = [],
  value,
  subtitle,
  tone = 'default',
}) {
  const isPrimary = size === 'primary'
  const isNegative = change?.startsWith('-') || tone === 'canceled'
  const changeTone = change ? (isNegative ? 'negative' : 'positive') : ''

  return (
    <article className={`kpi-card kpi-card-${size} tone-${tone}`}>
      <div className="kpi-card-head">
        <p className="kpi-card-label">{label}</p>
        {isPrimary ? (
          <Info size={14} strokeWidth={1.8} className="kpi-info" aria-label="Mais informações" />
        ) : null}
      </div>
      <div className="kpi-card-content">
        <div className="kpi-card-copy">
          <p className="kpi-card-value">{value}</p>
          <p className={`kpi-card-sub ${changeTone}`.trim()}>
            {change ? `${change} ` : null}
            <span>{subtitle}</span>
          </p>
        </div>
        {isPrimary ? (
          <KpiSparkline values={sparklineValues} color="var(--color-primary)" />
        ) : (
          Icon ? (
            <span className="kpi-icon" aria-hidden="true">
              <Icon size={18} strokeWidth={1.9} />
            </span>
          ) : null
        )}
      </div>
    </article>
  )
}
