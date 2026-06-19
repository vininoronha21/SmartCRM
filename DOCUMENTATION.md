# SmartCRM - Technical Documentation

**Version:** 0.1.0    
**Last Updated:** 2026-06-19

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Architecture](#architecture)
4. [Project Structure](#project-structure)
5. [Database Schema](#database-schema)
6. [API Specification](#api-specification)
7. [ETL Process](#etl-process)
8. [Frontend Architecture](#frontend-architecture)
9. [Setup & Installation](#setup--installation)
10. [Running the Application](#running-the-application)
11. [Development Workflow](#development-workflow)
12. [Testing](#testing)
13. [Deployment](#deployment)
14. [Troubleshooting](#troubleshooting)

---

## Project Overview

**SmartCRM** is an analytics-driven Customer Relationship Management system designed to transform raw e-commerce data into strategic business insights. The platform provides real-time dashboards, sales funnels, revenue analysis, and seller/category performance metrics.

### Key Objectives

- Extract, transform, and load (ETL) e-commerce transaction data
- Provide REST API endpoints for business metrics and analytics
- Display real-time insights through an interactive web dashboard
- Enable data-driven decision-making for sales and marketing teams

### Target Features

| Feature | Status |
|---------|--------|
| Sales funnel visualization | ✅ Implemented |
| Revenue metrics | ✅ Implemented |
| Seller & category ranking | ✅ Implemented |
| Payment distribution analysis | ✅ Implemented |
| Conversion rate tracking | ✅ Implemented |
| Date range filtering | ✅ Implemented |
| Authentication system | ✅ Implemented |
| Automated testing | ✅ Implemented |

---

## Technology Stack

### Backend

| Component | Technology | Version |
|-----------|-----------|---------|
| Framework | FastAPI | 0.115.0 |
| Server | Uvicorn | 0.30.6 |
| ORM | SQLAlchemy | 2.0.36 |
| Database Driver | psycopg | 3.2.3 |
| Data Processing | pandas | 2.2.3 |
| Numerical Computing | numpy | 2.4.3 |
| Python Version | Python | 3.13+ |

### Frontend

| Component | Technology | Version |
|-----------|-----------|---------|
| Framework | React | 19.2.6 |
| Build Tool | Vite | Latest |
| UI Icons | Lucide React | 1.17.0 |
| Charts | Chart.js | 4.5.1 |
| Chart Binding | react-chartjs-2 | 5.3.1 |
| Animations | GSAP | 3.15.0 |
| Linting | ESLint | Latest |

### Infrastructure

| Component | Technology | Version |
|-----------|-----------|---------|
| Production Database | Neon PostgreSQL | Managed |
| Production API Hosting | Render Web Service | Free Web Service |
| Production Frontend Hosting | Vercel | Static Build |
| Local Database | PostgreSQL | 15 |
| Local Containerization | Docker | Latest |
| Local Orchestration | Docker Compose | Latest |
| Environment Config | python-dotenv | 1.0.1 |

### Development Tools

| Component | Tool |
|-----------|------|
| Code Formatter | Ruff |
| Linter | Ruff (E, W, F, I, UP rules) |
| Testing | pytest |
| Import Sorting | Ruff isort |
| HTTP Client | httpx |

---

## Architecture

### System Overview

Production deployment:

```
┌─────────────────────────────────────────────────────────────┐
│                    Vercel Frontend                          │
│              React + Vite static dashboard                  │
│              VITE_API_BASE_URL -> Render /api/v1            │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTPS/REST
┌──────────────────────▼──────────────────────────────────────┐
│                    Render FastAPI API                       │
│              https://smartcrm-api-w95l.onrender.com         │
│              /health and /api/v1/* endpoints                │
└──────────────────────┬──────────────────────────────────────┘
                       │ SQLAlchemy + psycopg
┌──────────────────────▼──────────────────────────────────────┐
│                    Neon PostgreSQL                          │
│              Managed production database                    │
└─────────────────────────────────────────────────────────────┘
```

Local development can still run PostgreSQL and the API through Docker Compose:

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React + Vite)                   │
│              - Dashboard with real-time charts               │
│              - Authentication & session management           │
│              - Responsive UI with light/dark theme           │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP/REST
        ┌──────────────┴──────────────┐
        │                             │
┌───────▼──────────────┐    ┌────────▼─────────────┐
│   FastAPI Backend    │    │  API Documentation   │
│   - Analytics API    │    │  (Swagger/ReDoc)     │
│   - CORS middleware  │    │                      │
│   - Error handling   │    │                      │
└───────┬──────────────┘    └──────────────────────┘
        │ SQLAlchemy ORM
        │
┌───────▼──────────────────────────────┐
│  PostgreSQL Database                 │
│  - Customer data                     │
│  - Orders & transactions             │
│  - Products & sellers                │
│  - Payment information               │
└──────────────────────────────────────┘
```

### Data Flow

```
Raw CSV Files
    │
    ├─→ [ETL Layer] ─→ Extract
    │       │
    │       ├─→ Transform (normalize, aggregate, calculate metrics)
    │       │
    │       └─→ Load (insert into PostgreSQL)
    │
    ├─→ [Database Layer] ─→ Store (SQLAlchemy models)
    │
    ├─→ [API Layer] ─→ Analytics endpoints
    │
    └─→ [Frontend] ─→ Dashboard visualization
```

### Component Layers

1. **Presentation Layer (Frontend)**
   - React components for UI
   - State management via hooks
   - Chart.js for data visualization
   - Responsive CSS styling

2. **API Layer (Backend)**
   - FastAPI router endpoints
   - Request validation
   - Response serialization
   - Error handling

3. **Business Logic Layer (Backend)**
   - Analytics calculations
   - Data aggregation
   - Metrics computation

4. **Data Access Layer (Backend)**
   - SQLAlchemy ORM models
   - Database queries
   - Transaction management

5. **Data Storage Layer**
   - PostgreSQL relational database
   - Normalized schema design

---

## Project Structure

```
SmartCRM/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                 # FastAPI application entry point
│   │   ├── database.py             # Database connection & configuration
│   │   ├── utils.py                # Utility functions
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   ├── base.py             # SQLAlchemy Base class
│   │   │   ├── customer.py         # Customer model
│   │   │   ├── order.py            # Order model
│   │   │   ├── order_item.py       # Order item model
│   │   │   ├── order_payment.py    # Payment model
│   │   │   ├── order_review.py     # Review model
│   │   │   ├── product.py          # Product model
│   │   │   └── seller.py           # Seller model
│   │   ├── routers/
│   │   │   ├── __init__.py
│   │   │   └── analytics.py        # Analytics endpoints
│   │   └── etl/
│   │       ├── __init__.py
│   │       ├── explore.py          # Data exploration utilities
│   │       ├── load.py             # Data loading functions
│   │       ├── load_with_schema.py # Schema-aware loading
│   │       └── transform.py        # Data transformation logic
│   ├── tests/
│   │   ├── __init__.py
│   │   ├── conftest.py             # pytest configuration
│   │   └── test_analytics.py       # API endpoint tests
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx                 # Root application component
│   │   ├── App.css                 # Global styles
│   │   ├── index.css               # Base styles
│   │   ├── main.jsx                # React entry point
│   │   ├── api/
│   │   │   └── dashboardApi.js     # API client functions
│   │   ├── components/
│   │   │   ├── AboutPanel.jsx
│   │   │   ├── AlertsBanner.jsx
│   │   │   ├── ChartCard.jsx
│   │   │   ├── DataStates.jsx
│   │   │   ├── DateFilter.jsx
│   │   │   ├── FunnelChart.jsx
│   │   │   ├── FunnelDonutChart.jsx
│   │   │   ├── FunnelTrendLineChart.jsx
│   │   │   ├── InsightBox.jsx
│   │   │   ├── KpiSparkline.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── MetricCard.jsx
│   │   │   ├── OperationsPanel.jsx
│   │   │   ├── PaymentChannelsList.jsx
│   │   │   ├── PaymentPieChart.jsx
│   │   │   ├── PaymentRevenueBarChart.jsx
│   │   │   ├── ReportsPanel.jsx
│   │   │   ├── RevenueChart.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Skeletons.jsx
│   │   │   ├── ThemeToggle.jsx
│   │   │   ├── Topbar.jsx
│   │   │   ├── TopCategoriesBarChart.jsx
│   │   │   ├── TopProductsTable.jsx
│   │   │   └── TopSellersTable.jsx
│   │   ├── constants/
│   │   │   └── chart.js            # Chart configuration constants
│   │   ├── hooks/
│   │   │   ├── useDashboardData.js # Custom hook for data fetching
│   │   │   └── useTheme.js         # Theme management hook
│   │   ├── utils/
│   │   │   ├── chartData.js        # Chart data formatting
│   │   │   ├── dateRanges.js       # Date range utilities
│   │   │   ├── formatters.js       # Number & currency formatting
│   │   │   └── insights.js         # Business logic for insights
│   │   ├── assets/
│   │   └── index.html              # HTML entry point
│   ├── public/
│   ├── vite.config.js              # Vite build configuration
│   ├── eslint.config.js            # ESLint configuration
│   └── package.json                # Frontend dependencies
│
├── data/                           # Raw e-commerce datasets (CSV)
│   ├── customers_dataset.csv
│   ├── order_items_dataset.csv
│   ├── order_payments_dataset.csv
│   ├── order_reviews_dataset.csv
│   ├── orders_dataset.csv
│   ├── product_category_name_translation.csv
│   ├── products_dataset.csv
│   └── sellers_dataset.csv
│
├── docker-compose.yml              # Docker composition for local development
├── render.yaml                     # Render Blueprint for production API
├── requirements.txt                # Python dependencies
├── pyproject.toml                  # Project configuration (Ruff, pytest)
├── README.md                       # Project overview (Portuguese)
├── DOCUMENTATION.md                # This file
├── LICENSE                         # Project license
├── settings.json                   # Application settings
```

---

## Database Schema

### Entity-Relationship Diagram

```
┌─────────────────┐         ┌──────────────────┐
│   Customers     │         │     Sellers      │
├─────────────────┤         ├──────────────────┤
│ customer_id (PK)│         │ seller_id (PK)   │
│ customer_unique │         │ seller_city      │
│ customer_zip    │         │ seller_state     │
│ customer_city   │         └──────────────────┘
│ customer_state  │                  △
└────────┬────────┘                  │
         │                           │
         │ (1:N)                    │ (1:N)
         │                           │
    ┌────▼─────────────┐    ┌────────┴───────────┐
    │     Orders       │    │      Products      │
    ├──────────────────┤    ├────────────────────┤
    │ order_id (PK)    │    │ product_id (PK)    │
    │ customer_id (FK) │    │ product_category   │
    │ order_status     │    │ product_name       │
    │ order_date       │    │ product_weight     │
    │ order_approved   │    │ product_photos     │
    └────┬─────────────┘    └────────┬───────────┘
         │                           │
         │ (1:N)                    │ (1:N)
         │                           │
    ┌────▼──────────────────────────▼────┐
    │         Order Items                 │
    ├──────────────────────────────────────┤
    │ order_item_id (PK)                   │
    │ order_id (FK)                        │
    │ product_id (FK)                      │
    │ seller_id (FK)                       │
    │ shipping_limit_date                  │
    │ price                                │
    │ freight_value                        │
    └──────────────────────────────────────┘
         │
    ┌────┴────────────────────┐
    │ (1:N)                    │ (1:N)
    │                          │
┌───▼──────────────┐    ┌─────▼──────────────┐
│  Order Payments  │    │  Order Reviews     │
├──────────────────┤    ├────────────────────┤
│ payment_id (PK)  │    │ review_id (PK)     │
│ order_id (FK)    │    │ order_id (FK)      │
│ payment_type     │    │ review_score       │
│ payment_value    │    │ review_comment     │
│ payment_seq      │    │ review_creation    │
└──────────────────┘    └────────────────────┘
```

### Core Models

#### Customer
```python
- customer_id: String (PK)
- customer_unique_id: String
- customer_zip_code: String
- customer_city: String
- customer_state: String
```

#### Order
```python
- order_id: String (PK)
- customer_id: String (FK → Customer)
- order_status: String (created, approved, delivered, etc.)
- order_purchase_timestamp: DateTime
- order_approved_at: DateTime
- order_delivered_carrier_date: DateTime
- order_delivered_customer_date: DateTime
- order_estimated_delivery_date: DateTime
```

#### Product
```python
- product_id: String (PK)
- product_category_name: String
- product_name_lenght: Integer
- product_description_lenght: Integer
- product_photos_qty: Integer
- product_weight_g: Integer
- product_length_cm: Integer
- product_height_cm: Integer
- product_width_cm: Integer
```

#### Seller
```python
- seller_id: String (PK)
- seller_zip_code: String
- seller_city: String
- seller_state: String
```

#### OrderItem
```python
- order_item_id: Integer (PK)
- order_id: String (FK → Order)
- product_id: String (FK → Product)
- seller_id: String (FK → Seller)
- shipping_limit_date: DateTime
- price: Float
- freight_value: Float
```

#### OrderPayment
```python
- payment_sequential: Integer
- order_id: String (FK → Order)
- payment_type: String (credit_card, boleto, debit_card, etc.)
- payment_installments: Integer
- payment_value: Float
```

#### OrderReview
```python
- review_id: String (PK)
- order_id: String (FK → Order)
- review_score: Integer (1-5)
- review_comment_title: String
- review_comment_message: String
- review_creation_date: DateTime
- review_answer_timestamp: DateTime
```

---

## API Specification

### Base URL
```
http://localhost:8000/api/v1
```

### Authentication
The current backend API does not enforce authentication. The login experience is
implemented in the frontend UI layer.

### Response Format
All endpoints return JSON with the following structure:

**Success Response:**
```json
{
  "data": { /* endpoint-specific data */ },
  "meta": {
    "generated_at": "2026-06-19T10:30:00+00:00"
  }
}
```

**Error Response:**
```json
{
  "error": "Error message describing the issue",
  "status": "error",
  "timestamp": "2026-06-17T10:30:00Z"
}
```

### Endpoints

#### 1. Get Sales Funnel
```
GET /api/v1/funnel
Query Parameters:
  - start_date: string (optional, YYYY-MM-DD)
  - end_date: string (optional, YYYY-MM-DD)

Response:
{
  "data": [
    { "status": "delivered", "total": integer },
    { "status": "shipped", "total": integer },
    { "status": "canceled", "total": integer }
  ],
  "meta": { "generated_at": string }
}
```

#### 2. Get Conversion Rate
```
GET /api/v1/conversion-rate
Query Parameters:
  - start_date: string (optional, YYYY-MM-DD)
  - end_date: string (optional, YYYY-MM-DD)

Response:
{
  "data": {
    "total_orders": integer,
    "delivered": integer,
    "conversion_rate_pct": float
  },
  "meta": { "generated_at": string }
}
```

#### 3. Get Revenue
```
GET /api/v1/revenue
Query Parameters:
  - start_date: string (optional, YYYY-MM-DD)
  - end_date: string (optional, YYYY-MM-DD)

Response:
{
  "data": {
    "total_revenue": float
  },
  "meta": { "generated_at": string }
}
```

#### 4. Get Top Sellers
```
GET /api/v1/top-sellers
Query Parameters:
  - start_date: string (optional, YYYY-MM-DD)
  - end_date: string (optional, YYYY-MM-DD)
  - limit: integer (default: 10, max: 50)

Response:
{
  "data": [
    {
      "seller_id": string,
      "total_orders": integer,
      "total_revenue": float
    }
  ],
  "meta": { "generated_at": string }
}
```

#### 5. Get Top Product Categories
```
GET /api/v1/top-products
Query Parameters:
  - start_date: string (optional, YYYY-MM-DD)
  - end_date: string (optional, YYYY-MM-DD)
  - limit: integer (default: 10, max: 50)

Response:
{
  "data": [
    {
      "category": string,
      "total_orders": integer,
      "total_revenue": float
    }
  ],
  "meta": { "generated_at": string }
}
```

#### 6. Get Payment Distribution
```
GET /api/v1/payment-distribution
Query Parameters:
  - start_date: string (optional, YYYY-MM-DD)
  - end_date: string (optional, YYYY-MM-DD)

Response:
{
  "data": [
    {
      "payment_type": string,
      "total_orders": integer,
      "total_revenue": float
    }
  ],
  "meta": { "generated_at": string }
}
```

#### 7. Health Check
```
GET /health
Response:
{
  "status": "ok",
  "message": "SmartCRM API is running"
}
```

### Error Codes

| Code | Description |
|------|-------------|
| 200 | Request successful |
| 400 | Invalid query parameters |
| 401 | Unauthorized access |
| 404 | Resource not found |
| 500 | Server error |

---

## ETL Process

### Overview

The ETL (Extract, Transform, Load) pipeline processes raw CSV files from an e-commerce dataset and populates the PostgreSQL database with normalized, aggregated data.

### ETL Stages

#### 1. Extract (`extract`)
- Read CSV files from `data/` directory
- Validate file existence and format
- Apply pandas basic data type inference
- Handle missing/null values

**Input files:**
- `customers_dataset.csv`
- `orders_dataset.csv`
- `order_items_dataset.csv`
- `order_payments_dataset.csv`
- `order_reviews_dataset.csv`
- `products_dataset.csv`
- `sellers_dataset.csv`
- `product_category_name_translation.csv`

#### 2. Transform (`transform`)
- **Data Cleaning:** Remove duplicates, handle null values, trim whitespace
- **Type Conversion:** Convert timestamps, numeric values, categorical data
- **Normalization:** Standardize category names, payment types, order statuses
- **Feature Engineering:** Calculate derived metrics (total order value, revenue per seller, etc.)
- **Aggregation:** Group data by relevant dimensions for reporting

**Transformation Examples:**
```python
# Timestamp normalization
order_purchase_timestamp → DateTime

# Order status standardization
Status values: 'created', 'approved', 'unavailable', 'canceled', 'invoiced', 'processing', 'shipped', 'delivered'

# Revenue calculation
total_revenue = price + freight_value (for delivered orders only)

# Payment aggregation
Group payments by order for multi-installment orders
```

#### 3. Load (`load`)
- Connect to PostgreSQL database via SQLAlchemy
- Use ORM models to insert/update records
- Handle foreign key relationships
- Implement transaction management
- Perform data validation post-load

**Load Strategy:**
```
1. Create tables from SQLAlchemy models when needed
2. Check whether each table is empty
3. Load dimension tables first (Sellers, Customers, Products)
4. Load fact tables (Orders, OrderItems)
5. Load transactional tables (OrderPayments, OrderReviews)
6. Skip tables that already contain data
```

### ETL Execution

#### Running ETL via Python
```bash
cd backend
python -m app.etl.load_with_schema
```

To load a managed production database, provide `DATABASE_URL` explicitly:

```bash
cd backend
DATABASE_URL='postgresql://user:password@host/database?sslmode=require' python -m app.etl.load_with_schema
```

#### ETL Module Structure
```
app/etl/
├── __init__.py
├── explore.py           # Data exploration utilities
├── load.py              # Core loading functions
├── load_with_schema.py  # Schema-aware loading with validation
└── transform.py         # Data transformation logic
```

### Data Quality Checks

1. **Completeness:** Verify all required fields are populated
2. **Consistency:** Validate foreign key relationships
3. **Validity:** Check date ranges and value ranges
4. **Uniqueness:** Ensure primary key uniqueness
5. **Accuracy:** Verify calculated metrics against raw data

---

## Frontend Architecture

### Component Hierarchy

```
App
├── LoginPage (if not authenticated)
└── Dashboard (if authenticated)
    ├── Topbar
    │   ├── ThemeToggle
    │   └── DateFilter
    ├── Sidebar
    │   └── Navigation links
    ├── Main Content Area
    │   ├── AlertsBanner
    │   ├── MetricCard (KPIs)
    │   │   └── KpiSparkline
    │   ├── ChartCard (containers)
    │   │   ├── RevenueChart
    │   │   ├── FunnelChart
    │   │   ├── PaymentPieChart
    │   │   ├── TopSellersTable
    │   │   ├── TopCategoriesBarChart
    │   │   ├── TopProductsTable
    │   │   └── PaymentRevenueBarChart
    │   ├── ReportsPanel
    │   ├── OperationsPanel
    │   └── AboutPanel
    └── DataStates (loading/error states)
```

### State Management

**Custom Hooks:**
- `useDashboardData()` - Fetches data from API, manages loading/error states
- `useTheme()` - Manages light/dark theme preferences

**Local State:**
- Component-level state for UI interactions (filters, panel toggles)
- Session storage for authentication tokens

### Data Flow

```
User Interaction
    ↓
Component State Update
    ↓
API Call (dashboardApi.js)
    ↓
useDashboardData Hook
    ↓
Backend API Response
    ↓
State Update
    ↓
Component Re-render
    ↓
Chart/Table Display
```

### Key Components

#### MetricCard
Displays KPI values with trend sparklines and formatted currency/percentages.

**Props:**
```javascript
{
  title: string,
  value: number | string,
  formatted: string,
  trend: number (percentage),
  color: string
}
```

#### ChartCard
Wrapper component for chart visualization with consistent styling and loading states.

**Props:**
```javascript
{
  title: string,
  children: ReactNode,
  loading: boolean,
  error: string
}
```

#### FunnelChart / RevenueChart / PaymentPieChart
Chart.js wrapped components for different visualization types.

**Chart Types:**
- Line Chart: Revenue trends over time
- Bar Chart: Funnel stages, top sellers, categories
- Pie Chart: Payment distribution
- Donut Chart: Funnel trends

#### DateFilter
Allows users to select date ranges for data filtering.

**Props:**
```javascript
{
  onRangeChange: (startDate, endDate) => void,
  presets: string[] (today, week, month, quarter, year)
}
```

### Styling

**CSS Architecture:**
- `App.css` - Global layout and component styles
- `index.css` - Base typography and reset
- CSS Variables for theming (light/dark mode)

**Responsive Design:**
- Mobile-first approach
- Breakpoints for tablet and desktop
- Flexible grid layout for dashboard panels

### API Client

**File:** `src/api/dashboardApi.js`

Functions:
```javascript
// Fetch all dashboard core datasets in parallel
fetchDashboardCore(filters)

// Fetch revenue for one date bucket
fetchRevenueByRange(startDate, endDate)
```

---

## Setup & Installation

### Prerequisites

- **Python 3.13+** (for backend)
- **Node.js 18+** (for frontend)
- **PostgreSQL 15** (for local database, optional if using Docker)
- **Docker & Docker Compose** (recommended for local database/API setup)
- **Git** (for version control)

### Local Setup (Without Docker)

#### 1. Clone Repository
```bash
git clone https://github.com/yourusername/smartcrm.git
cd smartcrm
```

#### 2. Backend Setup

**Create Python virtual environment:**
```bash
python3.13 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

**Install dependencies:**
```bash
pip install -r requirements.txt
```

**Configure environment variables:**
```bash
cp .env.example .env
```

**.env file:**
```
DATABASE_URL=postgresql+psycopg://smartcrm_user:smartcrm_pass@localhost:5432/smartcrm_db
BACKEND_CORS_ORIGINS=http://localhost:5173
DEBUG=True
ENVIRONMENT=development
```

**Initialize database:**
```bash
cd backend
python -m app.etl.load_with_schema
```

#### 3. Frontend Setup

**Install dependencies:**
```bash
cd frontend
npm install
```

**Configure API endpoint:**
Create `.env.local` file:
```
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

#### 4. PostgreSQL Setup

**Create database:**
```bash
createdb smartcrm_db -U smartcrm_user
```

**Or use Docker:**
```bash
docker run --name smartcrm_postgres \
  -e POSTGRES_USER=smartcrm_user \
  -e POSTGRES_PASSWORD=smartcrm_pass \
  -e POSTGRES_DB=smartcrm_db \
  -p 5432:5432 \
  -v postgres_data:/var/lib/postgresql/data \
  postgres:15
```

### Docker Setup

#### Build and Run with Docker Compose

```bash
# From project root
docker-compose up -d

# Verify services
docker-compose ps

# View logs
docker-compose logs -f api
docker-compose logs -f db
```

#### Environment Configuration

Create `.env` file at project root:
```
DB_USER=smartcrm_user
DB_PASSWORD=smartcrm_pass
DB_NAME=smartcrm_db
BACKEND_CORS_ORIGINS=http://localhost:5173
DEBUG=False
ENVIRONMENT=docker
```

---

## Running the Application

### Backend Development Server

```bash
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**API Documentation:**
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### Frontend Development Server

```bash
cd frontend
npm run dev
```

**Access dashboard:**
- http://localhost:5173

### Production Build

**Backend:**
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

**Frontend:**
```bash
npm run build
npm run preview
```

### Running with Docker Compose

```bash
docker compose up -d api
```

**Services:**
- API: http://localhost:8000
- Database: localhost:5432

The frontend is run separately with Vite:

```bash
cd frontend
npm run dev
```

### Stopping Services

```bash
# Stop containers
docker-compose down

# Remove volumes (data)
docker-compose down -v
```

---

## Development Workflow

### Code Organization

- **Backend:** Follow PEP 8 style guide, use type hints
- **Frontend:** Use functional components with hooks, follow React best practices

### Linting & Formatting

**Backend (Ruff):**
```bash
# Format code
ruff format backend/

# Lint code
ruff check backend/ --fix
```

**Frontend (ESLint):**
```bash
npm run lint
npm run lint -- --fix
```

### Adding New Endpoints

1. **Create model** (if needed) in `backend/app/models/`
2. **Add route handler** in `backend/app/routers/analytics.py`
3. **Create tests** in `backend/tests/test_analytics.py`
4. **Update API documentation** in this file
5. **Create frontend hook** in `frontend/src/hooks/`
6. **Add component** in `frontend/src/components/`

### Adding New Components

1. **Create component file** in `frontend/src/components/`
2. **Export from components index** (if centralized)
3. **Add styles** to `App.css` or component-specific file
4. **Integrate** in parent component
5. **Test** in development server

---

## Testing

### Backend Testing

**Run all tests:**
```bash
pytest
```

**Run specific test file:**
```bash
pytest backend/tests/test_analytics.py
```

**Run with coverage:**
```bash
pytest --cov=app backend/tests/
```

**Test configuration:** `backend/tests/conftest.py`

### Test Examples

**Testing Analytics Endpoint:**
```python
def test_get_dashboard_summary(client):
    response = client.get("/api/v1/analytics/dashboard?start_date=2024-01-01&end_date=2024-12-31")
    assert response.status_code == 200
    assert "total_revenue" in response.json()
```

### Frontend Testing

Currently, frontend testing setup is not configured. Recommended:
- **Framework:** Jest
- **Testing Library:** React Testing Library
- **Coverage:** Target 80%+

### Integration Testing

**End-to-End Flow:**
1. Load data via ETL
2. Start backend server
3. Fetch API endpoints
4. Verify response structure and data types
5. Validate UI rendering

---

## Deployment

### Production Architecture

The production deployment does not depend on Docker running on a local machine.

```text
Vercel frontend
  -> VITE_API_BASE_URL=https://smartcrm-api-w95l.onrender.com/api/v1
  -> Render FastAPI API
  -> Neon PostgreSQL
```

### Production Environment Variables

**Render API:**

```env
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
BACKEND_CORS_ORIGINS=https://smartcrm-lime.vercel.app
DEBUG=False
ENVIRONMENT=production
```

The application accepts `postgresql://` and normalizes it to
`postgresql+psycopg://` in `backend/app/config.py`.

**Vercel Frontend:**

```env
VITE_API_BASE_URL=https://smartcrm-api-w95l.onrender.com/api/v1
```

### Render API Deployment

The repository includes `render.yaml`, which defines the `smartcrm-api` web
service.

Recommended flow:

1. Create a Neon PostgreSQL project.
2. Load the CSV data into the same Neon connection string that Render will use:
   ```bash
   cd backend
   DATABASE_URL='postgresql://user:password@host/database?sslmode=require' python -m app.etl.load_with_schema
   ```
3. Create a Render Blueprint from this repository.
4. Set `DATABASE_URL` in Render using the Neon connection string.
5. Deploy or restart the Render service.

Validation:

```bash
curl https://smartcrm-api-w95l.onrender.com/health
curl https://smartcrm-api-w95l.onrender.com/api/v1/conversion-rate
curl https://smartcrm-api-w95l.onrender.com/api/v1/revenue
```

### Vercel Frontend Deployment

1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Set `VITE_API_BASE_URL=https://smartcrm-api-w95l.onrender.com/api/v1`
5. Deploy

After changing `VITE_API_BASE_URL`, redeploy the frontend because Vite embeds
`VITE_*` variables at build time.

### Database Backups

```bash
# Backup PostgreSQL
pg_dump smartcrm_db -U smartcrm_user > backup.sql

# Restore
psql smartcrm_db -U smartcrm_user < backup.sql
```

---

## Troubleshooting

### Common Issues

#### 1. Database Connection Error
```
Error: could not connect to server: Connection refused
```
**Solution:**
- Verify PostgreSQL is running
- Check DATABASE_URL environment variable
- Ensure credentials are correct
- In production, ensure Render uses the same Neon connection string that was
  populated by the ETL loader

#### 2. CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution:**
- Check `BACKEND_CORS_ORIGINS`
- Update `VITE_API_BASE_URL` to match the Render API host
- Verify requests include correct headers

#### 3. ETL Load Fails
```
psycopg.errors.ForeignKeyViolation
```
**Solution:**
- Ensure dimension tables (Customers, Products, Sellers) load before fact tables
- Check for duplicate primary keys
- Validate CSV data format

#### 4. Frontend Build Error
```
Cannot find module '@/api/dashboardApi'
```
**Solution:**
- Update import paths to match actual file structure
- Check vite.config.js alias configuration
- Run `npm install` to ensure all dependencies installed

#### 5. Port Already in Use
```
Port 8000 is already in use
```
**Solution:**
- Kill existing process: `lsof -i :8000 | grep LISTEN | awk '{print $2}' | xargs kill`
- Or use different port: `uvicorn app.main:app --port 8001`

### Debug Mode

**Enable verbose logging:**
```python
# In main.py
import logging
logging.basicConfig(level=logging.DEBUG)
```

**Check API health:**
```bash
curl http://localhost:8000/health
```

**Database health check:**
```bash
psql -h localhost -U smartcrm_user -d smartcrm_db -c "SELECT 1"
```

---

## Performance Optimization

### Backend Optimization

1. **Database Indexes:** Add indexes on frequently queried columns
   ```sql
   CREATE INDEX idx_order_customer ON orders(customer_id);
   CREATE INDEX idx_order_status ON orders(order_status);
   ```

2. **Query Optimization:** Use select() with specific columns, implement pagination

3. **Caching:** Consider Redis for frequently accessed metrics

### Frontend Optimization

1. **Code Splitting:** Lazy load components with React.lazy()
2. **Asset Optimization:** Compress images, use WebP format
3. **Bundle Optimization:** Monitor bundle size with `npm run build -- --report`

---

## Contributing Guidelines

### Code Standards

- **Python:** PEP 8, type hints, docstrings
- **JavaScript:** ES6+, functional components, prop validation
- **Commit Messages:** Descriptive, reference issues when applicable

### Submitting Changes

1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes and test locally
3. Commit with clear messages: `git commit -m "Add feature description"`
4. Push branch: `git push origin feature/your-feature`
5. Create Pull Request with description

### Code Review Process

- Automated tests must pass
- Minimum one approval required
- Documentation updated if applicable

---

## Additional Resources

### Documentation Files
- [README.md](README.md) - Project overview (Portuguese)
- [docs/deploy-production.md](docs/deploy-production.md) - Production deployment guide
- [pyproject.toml](pyproject.toml) - Python project configuration
- [settings.json](settings.json) - Application settings

### External Resources
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [SQLAlchemy ORM Guide](https://docs.sqlalchemy.org/en/20/orm/)
- [React Documentation](https://react.dev/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Docker Documentation](https://docs.docker.com/)

### Support

For issues, questions, or contributions:
1. Check existing GitHub Issues
2. Create new Issue with detailed description
3. Submit Pull Request with fixes

---

**Version History:**
| Version | Date | Changes |
|---------|------|---------|
| 0.1.1 | 2026-06-19 | Documented Neon, Render, and Vercel production deployment |
| 0.1.0 | 2026-06-17 | Initial technical documentation |

---

**Last Updated:** 2026-06-19  
