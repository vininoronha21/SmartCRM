export function MetricCard({ label, value, subtitle, tone = 'default' }) {
  return (
    <article className={`kpi-card tone-${tone}`}>
      <p className="kpi-card-label">{label}</p>
      <p className="kpi-card-value">{value}</p>
      <p className="kpi-card-sub">{subtitle}</p>
    </article>
  )
}
