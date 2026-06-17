export function ChartCard({ action, children, className = '', size = 'sm', title }) {
  return (
    <section className={`chart-card ${className}`.trim()}>
      <div className="chart-card-header">
        <h2 className="chart-card-title">{title}</h2>
        {action ? <div className="chart-card-action">{action}</div> : null}
      </div>
      <div className={`chart-card-body chart-${size}`}>{children}</div>
    </section>
  )
}
