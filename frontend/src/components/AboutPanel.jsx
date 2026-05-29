import { Briefcase, Camera, Code2, Mail } from 'lucide-react'

export function AboutPanel({ isOpen, onClose }) {
  return (
    <>
      {isOpen ? <div className="drawer-overlay" onClick={onClose} /> : null}

      <aside
        className={`about-drawer ${isOpen ? 'open' : ''}`}
        aria-hidden={!isOpen}
        aria-label="Sobre o projeto"
      >
        <button
          type="button"
          className="drawer-close"
          onClick={onClose}
          aria-label="Fechar painel sobre o projeto"
        >
          ✕
        </button>

        <div className="about-illustration">
          <svg
            width="100%"
            viewBox="0 0 320 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <rect x="28" y="28" width="184" height="122" rx="18" fill="#F7FAFC" />
            <rect x="48" y="50" width="68" height="12" rx="6" fill="#7EB8F7" />
            <rect x="48" y="78" width="18" height="48" rx="7" fill="#A8E6C3" />
            <rect x="76" y="92" width="18" height="34" rx="7" fill="#F7D08A" />
            <rect x="104" y="68" width="18" height="58" rx="7" fill="#C4A8F7" />
            <path
              d="M142 122C150 102 164 92 190 88"
              stroke="#7EB8F7"
              strokeWidth="8"
              strokeLinecap="round"
            />
            <circle cx="190" cy="88" r="10" fill="#A8E6C3" />
            <path
              d="M224 70C250 70 270 90 270 116C270 142 250 162 224 162"
              stroke="#C4A8F7"
              strokeWidth="18"
              strokeLinecap="round"
            />
            <path
              d="M224 70C246 70 264 86 269 108"
              stroke="#F7D08A"
              strokeWidth="18"
              strokeLinecap="round"
            />
            <circle cx="224" cy="116" r="30" fill="#FFFFFF" />
            <circle cx="150" cy="154" r="17" fill="#F7D08A" />
            <path
              d="M145 177L128 190H188L169 177H145Z"
              fill="#7EB8F7"
            />
            <circle cx="190" cy="132" r="16" fill="#A8E6C3" />
            <path
              d="M176 190C178 166 189 148 204 148C219 148 230 166 232 190H176Z"
              fill="#C4A8F7"
            />
            <path
              d="M200 104L210 132L236 144"
              stroke="#374151"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="248" cy="46" r="8" fill="#F7D08A" />
            <circle cx="270" cy="58" r="5" fill="#7EB8F7" />
            <circle cx="64" cy="158" r="6" fill="#C4A8F7" />
          </svg>
        </div>

        <div className="about-project">
          <h2 className="about-title">SmartCRM</h2>
          <p className="about-subtitle">Customer & Sales Insights</p>
          <p className="about-description">
          Dashboard analítico construído com dados reais de e-commerce.
          Permite a visualização do funil de vendas, receita, conversão, ticket médio, distribuição de pagamentos e outras métricas, contando com filtros temporais e insights automáticos!
          Este é um projeto de portfólio que combina engenharia de software e análise de dados.
          </p>
        </div>

        <div className="about-links">
          <a
            href="https://github.com/vininoronha21"
            target="_blank"
            rel="noreferrer"
            className="about-link"
          >
            <Code2 className="about-link-icon" size={16} />
            GitHub
          </a>
          <a
            href="https://linkedin.com/in/viniciusnoronha"
            target="_blank"
            rel="noreferrer"
            className="about-link"
          >
            <Briefcase className="about-link-icon" size={16} />
            LinkedIn
          </a>
          <a
            href="mailto:contatovininoronha@gmail.com"
            className="about-link"
          >
            <Mail className="about-link-icon" size={16} />
            Email
          </a>
          <a
            href="https://instagram.com/viniinoronha"
            target="_blank"
            rel="noreferrer"
            className="about-link"
          >
            <Camera className="about-link-icon" size={16} />
            Instagram
          </a>
        </div>
      </aside>
    </>
  )
}
