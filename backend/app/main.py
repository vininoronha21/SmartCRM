from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine
from app.models import Base
from app.routers import analytics

app = FastAPI(
    title="SmartCRM API", description="Customer & Sales Insights", version="0.1.0"
)

Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # em produção, substitua pela URL do frontend no Render
    allow_methods=["GET"],
    allow_headers=["*"],
)

app.include_router(analytics.router, prefix="/api/v1", tags=["analytics"])


@app.get("/health")
def health_check():
    return {"status": "ok", "message": "SmartCRM API is running"}
