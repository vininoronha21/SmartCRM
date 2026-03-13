from datetime import datetime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey, Text, SmallInteger
from app.models.base import Base

class OrderReview(Base):
  __tablename__ = "order_reviews"

  review_id: Mapped[str] = mapped_column(primary_key=True)
  order_id: Mapped[str] = mapped_column(ForeignKey("orders.order_id"), nullable=False, index=True)  
  review_score: Mapped[int] = mapped_column(SmallInteger, nullable=False)
  review_comment_title: Mapped[str] = mapped_column(Text, nullable=True)
  review_comment_message: Mapped[str] = mapped_column(Text, nullable=True)
  review_creation_date: Mapped[datetime] = mapped_column(nullable=False)
  review_answer_timestamp: Mapped[datetime] = mapped_column(nullable=True)

  order: Mapped["Order"] = relationship(back_populates="reviews")

  # OBS: Por que SmallInteger para 'review_score'?
  # R: O score vai de 1 a 5. Um Integer normal ocupa 4 bytes para guardar um número
  # que nunca passa de 5. Um SmallInteger ocupa 2 bytes. 
  # Com 100k reviews, essa economia se multiplica
