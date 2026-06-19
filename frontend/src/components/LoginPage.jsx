import { useRef, useState, useLayoutEffect } from 'react'
import {
  BarChart3,
  LineChart,
  User,
  UsersRound,
} from 'lucide-react'
import gsap from 'gsap'

function AnimatedNumber({ value, type = 'number' }) {
  const [currentVal, setCurrentVal] = useState(0)

  useLayoutEffect(() => {
    let numericVal = 0
    if (type === 'currency') {
      numericVal = parseFloat(value.replace(/\./g, '').replace(',', '.'))
    } else if (type === 'percent') {
      numericVal = parseFloat(value.replace(',', '.'))
    } else {
      numericVal = parseInt(value, 10)
    }

    if (isNaN(numericVal)) return

    const obj = { val: 0 }
    const ctx = gsap.context(() => {
      gsap.to(obj, {
        val: numericVal,
        duration: 3,
        ease: 'power3.out',
        delay: 0.3,
        onUpdate: () => {
          setCurrentVal(obj.val)
        },
      })
    })

    return () => ctx.revert()
  }, [value, type])

  if (type === 'currency') {
    return (
      <>
        R${' '}
        {currentVal.toLocaleString('pt-BR', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </>
    )
  }
  if (type === 'percent') {
    return (
      <>
        {currentVal.toLocaleString('pt-BR', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
        %
      </>
    )
  }
  return <>{Math.round(currentVal)}</>
}

function LogoMark({ className = '' }) {
  return <span className={`login-logo-mark ${className}`.trim()} aria-hidden="true" />
}

function FeatureItem({ delay = '0ms', icon: Icon, title, text }) {
  return (
    <article className="login-feature" data-login-preview style={{ '--exit-delay': delay }}>
      <span className="login-feature-icon" aria-hidden="true">
        <Icon size={18} strokeWidth={1.8} />
      </span>
      <span>
        <strong>{title}</strong>
        <small>{text}</small>
      </span>
    </article>
  )
}

function PreviewCard({ children, className = '', delay = '0ms' }) {
  return (
    <article
      className={`login-preview-card ${className}`.trim()}
      data-login-preview
      style={{ '--exit-delay': delay }}
    >
      {children}
    </article>
  )
}

export function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const pageRef = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.login-story > *, .login-card > *', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: 'power3.out',
        clearProps: 'all',
      })
    }, pageRef)
    return () => ctx.revert()
  }, [])

  function handleSubmit(event) {
    event.preventDefault()
    const trimmedUsername = username.trim()

    if (!trimmedUsername || isSubmitting) {
      return
    }

    setIsSubmitting(true)
    const page = pageRef.current
    page?.classList.add('login-page-exiting')

    window.setTimeout(() => {
      onLogin(trimmedUsername)
    }, 190)
  }

  return (
    <main className="login-page" ref={pageRef} data-route-view="login">
      <section className="login-story" aria-label="Apresentação SmartCRM">
        <div className="login-brand" data-login-preview style={{ '--exit-delay': '0ms' }}>
          <LogoMark />
          <span>SmartCRM</span>
        </div>

        <div className="login-copy" data-login-preview style={{ '--exit-delay': '20ms' }}>
          <h1>
            O CRM completo para <strong>impulsionar</strong> seu negócio
          </h1>
          <p>
            Gestão de clientes, vendas e relacionamento em um só lugar. Simples,
            poderoso e inteligente.
          </p>
        </div>

        <div className="login-features">
          <FeatureItem
            delay="40ms"
            icon={BarChart3}
            title="Mais vendas"
            text="Acompanhe e converta mais oportunidades"
          />
          <FeatureItem
            delay="60ms"
            icon={UsersRound}
            title="Clientes felizes"
            text="Ofereça experiências personalizadas"
          />
          <FeatureItem
            delay="80ms"
            icon={LineChart}
            title="Decisões inteligentes"
            text="Relatórios e insights em tempo real"
          />
        </div>

        <div className="login-preview" aria-hidden="true">
          <span className="login-preview-path" />
          <PreviewCard className="pipeline-card" delay="20ms">
            <h2>Pipeline de vendas</h2>
            <div className="pipeline-grid">
              {[
                ['Novos', '125', '78%'],
                ['Em contato', '87', '62%'],
                ['Proposta', '64', '84%'],
                ['Negociação', '29', '49%'],
              ].map(([label, value, width]) => (
                <span key={label}>
                  <small>{label}</small>
                  <strong><AnimatedNumber value={value} /></strong>
                  <i style={{ width }} />
                </span>
              ))}
            </div>
          </PreviewCard>

          <PreviewCard className="revenue-card" delay="40ms">
            <h2>Receita total</h2>
            <strong><AnimatedNumber value="15.422.461,77" type="currency" /></strong>
            <small>+18,6% vs período anterior</small>
            <svg viewBox="0 0 160 54" role="img" aria-label="Tendência de receita">
              <polyline
                points="2,42 18,38 34,42 50,34 66,15 82,25 98,18 114,8 130,24 146,5 158,20"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </PreviewCard>

          <PreviewCard className="conversion-card" delay="60ms">
            <h2>Taxa de conversão</h2>
            <strong><AnimatedNumber value="97,02" type="percent" /></strong>
            <small>+2,7 p.p. vs período anterior</small>
            <svg viewBox="0 0 160 54" role="img" aria-label="Tendência de conversão">
              <polyline
                points="2,42 18,35 34,48 50,26 66,14 82,32 98,22 114,36 130,24 146,45"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </PreviewCard>

          <PreviewCard className="categories-card" delay="80ms">
            <h2>Top categorias por receita</h2>
            {['beleza_saude', 'relogios_presentes', 'cama_mesa_banho', 'esporte_lazer', 'informatica_acessorios'].map(
              (label, index) => (
                <span className="login-bar-row" key={label}>
                  <small>{label}</small>
                  <i style={{ width: `${92 - index * 10}%` }} />
                </span>
              ),
            )}
          </PreviewCard>
        </div>

      </section>

      <section className="login-access" aria-label="Acessar SmartCRM">
        <form className="login-card" onSubmit={handleSubmit}>
          <LogoMark className="login-card-logo" />
          <h2>Acessar SmartCRM</h2>
          <p>Acesso rápido ao CRM</p>

          <label className="login-field">
            <span>Nome de usuário</span>
            <span className="login-input-wrap">
              <User size={18} aria-hidden="true" />
              <input
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="Digite seu nome de usuário"
                disabled={isSubmitting}
                autoComplete="username"
                autoFocus
              />
            </span>
          </label>

          <button type="submit" className="login-submit" disabled={!username.trim() || isSubmitting}>
            {isSubmitting ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </section>

      <footer className="login-footer">© 2026 SmartCRM. Todos os direitos reservados.</footer>
    </main>
  )
}
