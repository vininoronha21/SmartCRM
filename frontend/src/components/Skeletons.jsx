export function SkeletonCard() {
  return (
    <div className="kpi-card" aria-hidden="true">
      <div
        className="skeleton"
        style={{ height: 12, width: '60%', marginBottom: 12 }}
      />
      <div
        className="skeleton"
        style={{ height: 32, width: '80%', marginBottom: 8 }}
      />
      <div className="skeleton" style={{ height: 40, width: '100%' }} />
    </div>
  )
}

export function SkeletonChart({ height = 220 }) {
  return (
    <div className="chart-card" aria-hidden="true">
      <div
        className="skeleton"
        style={{ height: 16, width: '40%', marginBottom: 16 }}
      />
      <div className="skeleton" style={{ height }} />
    </div>
  )
}
