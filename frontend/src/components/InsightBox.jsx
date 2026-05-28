export function InsightBox({ text }) {
  return (
    <div className="insight-box" role="note">
      <span className="insight-icon" aria-hidden="true">
        i
      </span>
      <p>{text}</p>
    </div>
  )
}
