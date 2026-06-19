# SmartCRM

> SmartCRM - De dados brutos de um e-commerce a decisões estratégicas de venda.

🔗 **[Acesse o projeto na web](https://smartcrm-lime.vercel.app)**

---

## O que é o SmartCRM? Que problema ele resolve?

Um CRM analítico bom não serve apenas para listar clientes: ele precisa mostrar onde o dinheiro entra, onde o funil perde eficiência e quais vendedores, categorias e meios de pagamento sustentam o resultado.

Desenvolvi o SmartCRM com a finalidade de pegar uma base de dados real e organizá-la em uma API analítica e um dashboard direto.

A ideia é simples: analisar uma base de dados com foco em decisão e impacto de negócio, extraindo estratégias por meio de números e ações.


## 📸 Tela de Login
<img src=screenshots/login.png width=800>

---

## O que o projeto entrega

- Visão rápida de receita, pedidos, conversão, cancelamentos, ticket médio, sellers ativos e categoria líder.
- Funil de pedidos por status para separar venda criada de venda realmente entregue.
- Ranking de sellers e categorias com concentração de receita.
- Distribuição de pagamentos para entender comportamento de compra.
- Filtros de período para comparar recortes sem recalcular métricas manualmente.
- Testes automatizados validando a API sobre a base de dados.

---

## ✨ Funcionalidades

### 📈 Métricas implementadas

<img src=screenshots/inside.png width=600>

| Métrica | Definição |
|---|---|
| Funil de vendas | Contagem de pedidos por status |
| Taxa de conversão | `delivered / total_orders` |
| Receita total | Soma de `payment_value` para pedidos `delivered` |
| Top seller | Seller com maior receita em `price + freight_value` |
| Top categoria | Categoria com maior receita em `price` |
| Pagamento dominante | Pedidos agrupados por tipo de pagamento |

### 📝 Insights extraídos

<img src=screenshots/light2.png width=800>

- **97,02%** de conversão operacional: 96.478 de 99.441 pedidos chegaram a `delivered`.
- Receita realizada superior a **R$ 15,4M** (apenas pedidos entregues).
- Cartão de crédito domina o comportamento de pagamento: **76.505 pedidos (~77%)**.
- **Beleza & Saúde** lidera a receita por categoria.
- Maior seller gerou **R$ 249.640,70** em receita calculada por item + frete.

### 🌙 Dark Mode

<img src=screenshots/dark5.png width=800>

---

<img src=screenshots/dark2.png width=800>

O dashboard suporta modo escuro com cores e contrastes ajustados para leitura confortável.

### 🎛️ Controle e filtros

- **Filtro de datas:** seleção de período personalizado (data inicial e final).
- **Validação inteligente:** previne seleção de datas inválidas.

### 🐳 Banco de dados em container Docker

<img src=screenshots/docker.png width=600>

### 📊 Visualizações dinâmicas e interativas

<img src=screenshots/light6.png width=800>

---

<img src=screenshots/light2.png width=800>

### 🎲 Reports com base de dados

<img src=screenshots/light4.png width=800> 

---

<img src=screenshots/light5.png width=800>

### ⚪ Endpoints disponíveis

<img src=screenshots/endpoints.png width=600>

---

## 📦 Stack
- Python 3.13+
- FastAPI
- SQLAlchemy
- PostgreSQL 15 local via Docker
- Neon PostgreSQL em produção
- Render para hospedagem da API
- Vercel para hospedagem do frontend
- Pytest
- React 19
- Vite
- Chart.js + react-chartjs-2
- GSAP
- lucide-react
- HTML, CSS

---

## 📂 Estrutura de pastas

```
backend/app/         # API, models, ETL, routers e utils
backend/tests/       # Testes dos endpoints
frontend/src/        # Criação visual do CRM
data/                # CSVs reais da base de dados
docker-compose.yml   # PostgreSQL local
render.yaml          # Blueprint da API no Render
requirements.txt     # Dependências
```

---

## 🧪 Testes e validações

```bash
cd backend && python -m pytest tests/ -v
```

## 🐳 Docker local: API, banco e carga de dados

O Docker é usado como ambiente local de desenvolvimento. Ele permite subir um
PostgreSQL reproduzível, testar a API e carregar a base sem depender de serviços
externos.

Suba o PostgreSQL e carregue os CSVs pelo container `load-data`:

```bash
docker compose build api load-data
docker compose --profile load up load-data
```

Depois, mantenha a API online em `http://localhost:8000`:

```bash
docker compose up -d api
```

Checks rápidos:

```bash
curl http://localhost:8000/health
curl http://localhost:8000/api/v1/revenue
```

Observação: o loader pula tabelas que já possuem dados. Para recarregar do zero,
remova o volume `postgres_data` antes de rodar a carga novamente.

## 🚀 Produção sem Docker local

Em produção, o projeto não depende do Docker rodando na máquina local. A
arquitetura publicada usa:

```text
Vercel frontend
  -> VITE_API_BASE_URL=https://smartcrm-api-w95l.onrender.com/api/v1
  -> Render FastAPI
  -> Neon PostgreSQL
```

- **Vercel:** hospeda o dashboard React/Vite.
- **Render:** hospeda a API FastAPI em `https://smartcrm-api-w95l.onrender.com`.
- **Neon:** hospeda o PostgreSQL com os dados carregados a partir dos CSVs.
- **Docker:** permanece útil para desenvolvimento local, mas não é necessário
  para manter o dashboard online.

Endpoints de validação:

```bash
curl https://smartcrm-api-w95l.onrender.com/health
curl https://smartcrm-api-w95l.onrender.com/api/v1/revenue
curl https://smartcrm-api-w95l.onrender.com/api/v1/conversion-rate
```

Para configurar ou reproduzir o deploy, veja o guia completo:
[Deploy de produção](docs/deploy-production.md).

---

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👨‍💻 Autor

Desenvolvido por **Vinícius Noronha Forte**

- 🐙 GitHub: [vininoronha21](https://github.com/vininoronha21)
- 💼 LinkedIn: [Vinícius Noronha Forte](https://linkedin.com/in/viniciusnoronha)
- 📧 Email: contatovininoronha@gmail.com
