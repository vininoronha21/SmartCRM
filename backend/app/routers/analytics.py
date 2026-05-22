from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy import Numeric, cast, func, select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.order_payment import OrderPayment
from app.models.product import Product

router = APIRouter()

DbSession = Annotated[Session, Depends(get_db)]


@router.get("/funnel")
def get_sales_funnel(db: DbSession):
    """
    Retorna a contagem de pedidos agrupada por status.

    Por que essa query? O funil de vendas mostra onde os pedidos
    estão concentrados e onde há gargalos no processo de venda.
    """
    # func.count() é o equivalente ao COUNT(*) do SQL
    # group_by agrupa os resultados por valor único de order_status
    result = db.execute(
        select(Order.status, func.count().label("total"))
        .group_by(Order.status)
        .order_by(func.count().desc())
    ).all()

    # Converte lista de Row para lista de dicts serializáveis
    return [{"status": row.status, "total": row.total} for row in result]


@router.get("/conversion-rate")
def get_conversion_rate(db: DbSession):
    """
    Retorna a taxa de conversão: pedidos entregues / total de pedidos.
    Métrica central do funil — indica a eficiência do processo de venda.
    """
    result = db.execute(
        select(Order.status, func.count().label("total")).group_by(Order.status)
    ).all()

    total = sum(row.total for row in result)
    delivered = next((row.total for row in result if row.status == "delivered"), 0)
    rate = round((delivered / total) * 100, 2) if total > 0 else 0

    return {"total_orders": total, "delivered": delivered, "conversion_rate_pct": rate}


@router.get("/revenue")
def get_revenue(db: DbSession):
    """
    Retorna a receita total somando todos os pagamentos realizados.
    Considera apenas pedidos delivered para refletir receita realizada.
    """
    result = db.execute(
        select(func.sum(OrderPayment.payment_value).label("total_revenue"))
        .join(Order, Order.order_id == OrderPayment.order_id)
        .where(Order.status == "delivered")
    ).scalar()

    return {"total_revenue": round(result or 0, 2)}


@router.get("/top-sellers")
def get_top_sellers(db: DbSession, limit: int = 10):
    """
    Retorna os sellers com maior receita gerada.
    """
    result = db.execute(
        select(
            OrderItem.seller_id,
            func.count(OrderItem.order_id.distinct()).label("total_orders"),
            func.round(
                cast(func.sum(OrderItem.price + OrderItem.freight_value), Numeric), 2
            ).label("total_revenue"),
        )
        .group_by(OrderItem.seller_id)
        .order_by(func.sum(OrderItem.price + OrderItem.freight_value).desc())
        .limit(limit)
    ).all()

    return [
        {
            "seller_id": row.seller_id,
            "total_orders": row.total_orders,
            "total_revenue": float(row.total_revenue),
        }
        for row in result
    ]


@router.get("/payment-distribution")
def get_payment_distribution(db: DbSession):
    """
    Retorna a distribuição de pedidos por tipo de pagamento.
    Ajuda a entender a preferência de pagamento dos clientes.
    """
    result = db.execute(
        select(
            OrderPayment.payment_type,
            func.count(OrderPayment.order_id.distinct()).label("total_orders"),
            func.round(cast(func.sum(OrderPayment.payment_value), Numeric), 2).label(
                "total_revenue"
            ),
        )
        .group_by(OrderPayment.payment_type)
        .order_by(func.count(OrderPayment.order_id.distinct()).desc())
    ).all()

    return [
        {
            "payment_type": row.payment_type,
            "total_orders": row.total_orders,
            "total_revenue": float(row.total_revenue),
        }
        for row in result
    ]


@router.get("/top-products")
def get_top_products(db: DbSession, limit: int = 10):
    """
    Retorna os produtos com maior receita gerada.
    Agrupa por categoria quando product_id não é suficiente para análise de negócio.
    """
    result = db.execute(
        select(
            Product.category_name,
            func.count(OrderItem.order_id.distinct()).label("total_orders"),
            func.round(cast(func.sum(OrderItem.price), Numeric), 2).label(
                "total_revenue"
            ),
        )
        .join(Product, Product.product_id == OrderItem.product_id)
        .group_by(Product.category_name)
        .order_by(func.sum(OrderItem.price).desc())
        .limit(limit)
    ).all()

    return [
        {
            "category": row.category_name,
            "total_orders": row.total_orders,
            "total_revenue": float(row.total_revenue),
        }
        for row in result
    ]
