from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import Text
from app.models.base import Base

class Product(Base):
  __tablename__ = "products"

  # Mantém apenas a categoria em português
  
  product_id: Mapped[str] = mapped_column(primary_key=True)
  category_name: Mapped[str] = mapped_column(nullable=True)
  category_name: Mapped[str] = mapped_column(nullable=True)
  name_length: Mapped[int] = mapped_column(nullable=True)
  description_length: Mapped[int] = mapped_column(nullable=True)
