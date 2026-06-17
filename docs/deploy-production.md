# Deploy de producao sem depender do Docker local

Hoje o Docker deve ser tratado apenas como ambiente local. Para o dashboard continuar online com sua maquina desligada, a producao precisa ter:

1. Um PostgreSQL gerenciado na nuvem.
2. A API FastAPI hospedada em um servico web.
3. O frontend da Vercel apontando para a URL publica dessa API.

## Arquitetura alvo

```text
Vercel frontend
  -> VITE_API_BASE_URL=https://sua-api.com/api/v1
  -> API FastAPI hospedada
  -> DATABASE_URL=postgresql+psycopg://...banco-gerenciado...
```

O container `smartcrm_db` continua util para desenvolvimento, mas nao deve ser a fonte de dados da versao publica.

## Opcao recomendada para esta sprint

Use um PostgreSQL gerenciado free continuo e publique a API como web service free. A combinacao recomendada para esta sprint e:

- Neon para o PostgreSQL.
- Render Free Web Service para a API FastAPI.
- Vercel para o frontend React.

Evite Render Postgres no plano free como solucao permanente: o plano gratuito atual do Render Postgres tem limite de 30 dias. O Render continua util para hospedar a API no plano free.

Observacoes do plano free:

- Neon Free: sem limite de tempo e sem cartao obrigatorio, com 0.5 GB de storage por projeto.
- Supabase Free: dois projetos gratuitos, banco Postgres dedicado e 500 MB de database size por projeto.
- Render Free Web Service: hospeda Python/FastAPI gratuitamente, mas pode "dormir" quando fica sem trafego. Na primeira requisicao apos inatividade, pode demorar alguns segundos para acordar.

## Arquivos preparados no repositorio

- `render.yaml`: define o servico `smartcrm-api` no Render Free Web Service.
- `.python-version`: fixa Python 3.13 no Render.
- `.env.example`: lista as variaveis da API.
- `frontend/.env.example`: lista a variavel do frontend na Vercel.

O `render.yaml` deixa `DATABASE_URL` com `sync: false`, entao o Render vai pedir o valor no painel sem salvar segredo no Git.

## Passo 1: criar o banco no Neon

1. Acesse `https://console.neon.tech`.
2. Crie um novo projeto.
3. Escolha PostgreSQL na regiao mais proxima disponivel no plano free.
4. Abra o modal `Connect`.
5. Copie a connection string no formato:

```env
postgresql://usuario:senha@ep-...neon.tech/dbname?sslmode=require&channel_binding=require
```

Use a URL do pooler se o Neon oferecer essa opcao. O projeto aceita `postgresql://...` porque a API converte automaticamente para `postgresql+psycopg://...`.

## Passo 2: carregar os CSVs no banco remoto

No terminal local, usando a connection string do Neon:

```bash
cd backend
DATABASE_URL='postgresql://usuario:senha@ep-...neon.tech/dbname?sslmode=require&channel_binding=require' python -m app.etl.load_with_schema
```

Esse comando cria as tabelas e carrega os CSVs. Ele pula tabelas que ja possuem dados.

Depois, rode uma checagem rapida:

```bash
DATABASE_URL='postgresql://usuario:senha@ep-...neon.tech/dbname?sslmode=require&channel_binding=require' python - <<'PY'
from sqlalchemy import text
from app.database import engine

with engine.connect() as conn:
    print(conn.execute(text("select count(*) from orders")).scalar())
PY
```

## Variaveis de ambiente

Na API hospedada:

```env
DATABASE_URL=postgresql+psycopg://usuario:senha@host:5432/banco?sslmode=require
BACKEND_CORS_ORIGINS=https://smartcrm-lime.vercel.app
ENVIRONMENT=production
DEBUG=False
```

Se o provedor entregar a URL como `postgresql://...`, o projeto normaliza automaticamente para `postgresql+psycopg://...`.

Na Vercel, no projeto do frontend:

```env
VITE_API_BASE_URL=https://sua-api-hospedada.com/api/v1
```

Depois de alterar essa variavel, faca novo deploy do frontend.

## Passo 3: publicar a API no Render

Com `render.yaml`, o caminho recomendado e criar um Blueprint:

1. Acesse `https://dashboard.render.com/blueprints`.
2. Clique em `New Blueprint Instance`.
3. Conecte este repositorio.
4. Confirme o servico `smartcrm-api`.
5. Quando o Render pedir `DATABASE_URL`, cole a connection string do Neon.
6. Crie o Blueprint e aguarde o deploy.

Se preferir criar manualmente um Web Service, use:

Comando de build:

```bash
pip install -r requirements.txt
```

Comando de start:

```bash
cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

Health check:

```text
/health
```

Quando o deploy terminar, a API ficara em uma URL parecida com:

```text
https://smartcrm-api.onrender.com
```

Teste:

```bash
curl https://smartcrm-api.onrender.com/health
curl https://smartcrm-api.onrender.com/api/v1/revenue
```

## Passo 4: apontar a Vercel para a API

No projeto `smartcrm-lime` da Vercel, configure:

```env
VITE_API_BASE_URL=https://smartcrm-api.onrender.com/api/v1
```

Depois rode um novo deploy do frontend.

## Checklist da sprint

- [ ] Criar banco PostgreSQL no Neon.
- [ ] Copiar a connection string externa do banco.
- [ ] Rodar `python -m app.etl.load_with_schema` contra o banco remoto.
- [ ] Configurar `DATABASE_URL` na API hospedada.
- [ ] Configurar `BACKEND_CORS_ORIGINS` com a URL da Vercel.
- [ ] Publicar a API FastAPI.
- [ ] Testar `https://sua-api-hospedada.com/health`.
- [ ] Testar `https://sua-api-hospedada.com/api/v1/revenue`.
- [ ] Configurar `VITE_API_BASE_URL` na Vercel.
- [ ] Fazer novo deploy do frontend.
- [ ] Desligar Docker e validar o dashboard publicado.
