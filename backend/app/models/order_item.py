from decimal import Decimal
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey, Numeric
from app.models.base import Base

class OrderItem(Base):
  __tablename__ = "order_items"

  order_id: Mapped[str] = mapped_column(ForeignKey("orders.order_id"), primary_key=True)
  order_item_id: Mapped[int] = mapped_column(primary_key=True)
  product_id: Mapped[str] = mapped_column(ForeignKey("products.product_id"), nullable=False)
  seller_id: Mapped[str] = mapped_column(ForeignKey("sellers.seller_id"), nullable=False)
  price: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
  freight_value: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
  
  order: Mapped["Order"] = relationship(back_populates="items")