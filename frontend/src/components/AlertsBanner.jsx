export function AlertsBanner({ alerts, dismissedAlerts, onDismiss }) {
  const visibleAlerts = alerts.filter((alert) => !dismissedAlerts.includes(alert.id))

  if (!visibleAlerts.length) {
    return null
  }

  return (
    <section className="alerts-stack" aria-label="Alertas de métricas">
      {visibleAlerts.map((alert) => (
        <article key={alert.id} className="alert-banner" role="alert">
          <span className="alert-icon" aria-hidden="true">
            !
          </span>
          <p>{alert.message}</p>
          <button
            type="button"
            className="alert-close"
            onClick={() => onDismiss(alert.id)}
            aria-label="Dispensar alerta"
          >
            x
          </button>
        </article>
      ))}
    </section>
  )
}
