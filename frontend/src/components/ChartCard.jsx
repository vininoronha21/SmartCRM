export function ChartCard({ title, size = 'sm', children }) {
  return (
    <section className="chart-card">
      <div className="chart-card-header">
        <h2 className="chart-card-title">{title}</h2>
      </div>
      <div className={`chart-card-body chart-${size}`}>{children}</div>
    </section>
  )
}
