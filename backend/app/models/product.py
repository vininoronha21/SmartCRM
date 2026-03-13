from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import Text
from app.models.base import Base

class Product(Base):
  __tablename__ = "products"

  product_id: Mapped[str] = mapped_column(primary_key=True)
  category_name: Mapped[str] = mapped_column(nullable=True)
  category_name_english: Mapped[str] = mapped_column(nullable=True)
  weight_g: Mapped[int] = mapped_column(nullable=True)
  length_cm: Mapped[int] = mapped_column(nullable=True)
  height_cm: Mapped[int] = mapped_column(nullable=True)
  width_cm: Mapped[int] = mapped_column(nullable=True)

  # OBS: 'category_name_english' não existe no CSV original, o que acontece é que tem
  # um arquivo chamado 'product_category_name_translation.csv', e no ETL vou fazer o join
  # desses dois arquivos para já salvar a tradução diretamente na tabela de PRODUTOS.
