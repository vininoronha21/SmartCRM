# Testes de integração para os endpoints analíticos.
# Usam banco real (Docker) — sem mocks.


def test_funnel_returns_all_statuses(client):
    response = client.get("/api/v1/funnel")
    assert response.status_code == 200

    data = response.json()
    statuses = [item["status"] for item in data]
    assert "delivered" in statuses
    assert all("status" in item and "total" in item for item in data)
    assert all(item["total"] > 0 for item in data)


def test_conversion_rate_structure(client):
    response = client.get("/api/v1/conversion-rate")
    assert response.status_code == 200

    data = response.json()
    assert "total_orders" in data
    assert "conversion_rate_pct" in data


def test_conversion_rate_logic():
    total = 100
    delivered = 97
    rate = round((delivered / total) * 100, 2)
    assert rate == 97.0

    # Edge case: zero total
    total_zero = 0
    rate_zero = round((0 / total_zero) * 100, 2) if total_zero > 0 else 0
    assert rate_zero == 0


def test_revenue_is_positive(client):
    response = client.get("/api/v1/revenue")
    assert response.status_code == 200

    data = response.json()
    assert data["total_revenue"] >= 0


def test_top_sellers_default_limit(client):
    response = client.get("/api/v1/top-sellers")
    assert response.status_code == 200

    data = response.json()
    assert len(data) == 10
    assert all("seller_id" in item and "total_revenue" in item for item in data)
    # valida ordenação decrescente
    revenues = [item["total_revenue"] for item in data]
    assert revenues == sorted(revenues, reverse=True)


def test_payment_distribution_has_credit_card(client):
    response = client.get("/api/v1/payment-distribution")
    assert response.status_code == 200

    data = response.json()
    types = [item["payment_type"] for item in data]
    assert "credit_card" in types


def test_top_products_default_limit(client):
    response = client.get("/api/v1/top-products")
    assert response.status_code == 200

    data = response.json()
    assert len(data) == 10
    assert all("category" in item and "total_revenue" in item for item in data)

    revenues = [item["total_revenue"] for item in data]
    assert revenues == sorted(revenues, reverse=True)
