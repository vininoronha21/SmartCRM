from sqlalchemy.orm import Mapped, mapped_column
from app.models.base import Base

class Seller(Base):
  __tablename__ = "sellers"

  seller_id: Mapped[str] = mapped_column(primary_key=True)
  zip_code_prefix: Mapped[str] = mapped_column(nullable=True)
  city: Mapped[str] = mapped_column(nullable=True)
  state: Mapped[str] = mapped_column(nullable=True)
  