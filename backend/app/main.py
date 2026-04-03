from fastapi import FastAPI
from app.database import engine
from app.models import Base

app = FastAPI(title="SmartCRM API",
              description="Customer & Sales Insights",
              version="0.1.0")

Base.metadata.create_all(bind=engine)

@app.get("/health")
def health_check():
  return {"status": "ok", "message": "SmartCRM API is running"}
