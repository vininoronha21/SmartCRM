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

- Neon ou Supabase para o PostgreSQL.
- Render Free Web Service para a API FastAPI.
- Vercel para o frontend React.

Evite Render Postgres no plano free como solucao permanente: o plano gratuito atual do Render Postgres tem limite de 30 dias. O Render continua util para hospedar a API no plano free.

Observacoes do plano free:

- Neon Free: sem limite de tempo e sem cartao obrigatorio, com 0.5 GB de storage por projeto.
- Supabase Free: dois projetos gratuitos, banco Postgres dedicado e 500 MB de database size por projeto.
- Render Free Web Service: hospeda Python/FastAPI gratuitamente, mas pode "dormir" quando fica sem trafego. Na primeira requisicao apos inatividade, pode demorar alguns segundos para acordar.

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

## Carga dos dados no banco remoto

Com a `DATABASE_URL` do banco gerenciado configurada localmente, rode:

```bash
cd backend
python -m app.etl.load_with_schema
```

Esse comando cria as tabelas e carrega os CSVs. Ele pula tabelas que ja possuem dados.

## Deploy da API em um servico Python

Configure o servico usando a raiz do repositorio como root directory.

Comando de build:

```bash
pip install -r requirements.txt
```

Comando de start:

```bash
cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

## Checklist da sprint

- [ ] Criar banco PostgreSQL gerenciado.
- [ ] Copiar a connection string externa do banco.
- [ ] Configurar `DATABASE_URL` na API hospedada.
- [ ] Configurar `BACKEND_CORS_ORIGINS` com a URL da Vercel.
- [ ] Rodar `python -m app.etl.load_with_schema` contra o banco remoto.
- [ ] Publicar a API FastAPI.
- [ ] Testar `https://sua-api-hospedada.com/health`.
- [ ] Testar `https://sua-api-hospedada.com/api/v1/revenue`.
- [ ] Configurar `VITE_API_BASE_URL` na Vercel.
- [ ] Fazer novo deploy do frontend.
- [ ] Desligar Docker e validar o dashboard publicado.
