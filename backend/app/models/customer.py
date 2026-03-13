from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base

class Customer(Base):
  __tablename__ = "customers"

  customer_id: Mapped[str] = mapped_column(primary_key=True)
  customer_unique_id: Mapped[str] = mapped_column(nullable=False, index=True)
  zip_code_prefix: Mapped[str] = mapped_column(nullable=True)
  city: Mapped[str] = mapped_column(nullable=True)
  state: Mapped[str] = mapped_column(nullable=True)

  orders: Mapped[list["Order"]] = relationship(back_populates="customer")
  