export function EmptyState({
  message = 'Nenhum dado encontrado para o período selecionado.',
}) {
  return (
    <div className="data-state data-state-empty">
      <span className="data-state-icon">○</span>
      <span>{message}</span>
    </div>
  )
}

export function ErrorState({ onRetry }) {
  return (
    <div className="data-state data-state-error">
      <span>Erro ao carregar dados.</span>
      {onRetry ? (
        <button type="button" onClick={onRetry} className="btn-secondary">
          Tentar novamente
        </button>
      ) : null}
    </div>
  )
}
