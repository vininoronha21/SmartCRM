from datetime import datetime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey
from app.models.base import Base

class Order(Base):
  __tablename__ = "orders"

  order_id: Mapped[str] = mapped_column(primary_key=True)
  customer_id: Mapped[str] = mapped_column(
    ForeignKey("customers.customer_id"), nullable=False, index=True)
  status: Mapped[str] = mapped_column(nullable=False, index=True)
  purchase_timestamp: Mapped[datetime] = mapped_column(nullable=False)
  approved_at: Mapped[datetime] = mapped_column(nullable=True)
  delivered_carrier_date: Mapped[datetime] = mapped_column(nullable=True)
  delivered_customer_date: Mapped[datetime] = mapped_column(nullable=True)
  estimated_delivery_date: Mapped[datetime] = mapped_column(nullable=True)


  customer: Mapped["Customer"] = relationship(back_populates="orders")
  items: Mapped[list["OrderItem"]] = relationship(back_populates="order")
  payments: Mapped[list["OrderPayment"]] = relationship(back_populates="order")
  reviews: Mapped[list["OrderReview"]] = relationship(back_populates="order")
  