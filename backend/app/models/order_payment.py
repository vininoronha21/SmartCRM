from decimal import Decimal
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey, Numeric
from app.models.base import Base

class OrderPayment(Base):
  __tablename__ = "order_payments"

  order_id: Mapped[str] = mapped_column(ForeignKey("orders.order_id"), primary_key=True)
  payment_sequential: Mapped[int] = mapped_column(primary_key=True)
  payment_type: Mapped[str] = mapped_column(nullable=False)
  payment_installments: Mapped[int] = mapped_column(nullable=False)
  payment_value: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)

  order: Mapped["Order"] = relationship(back_populates="payments")
  