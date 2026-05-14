# Script para carregar os dados tratados do transform.py
# Objetivo: RECEBER os DF limpos do transform.py e inserir no PostgreSQL na ordem correta, respeitando Foreign Keys

import time
import pandas as pd
from sqlalchemy import text
from app.database import engine
from app.etl.transform import (
    transform_sellers,
    transform_customers,
    transform_products,
    transform_orders,
    transform_order_items,
    transform_order_payments,
    transform_order_reviews,
)

# Tamanho do batch para inserção em lote
# 1000 linhas por query é um bom equilíbrio entre velocidade e uso de memória
# Aumentar demais pode causar erros de "query too large" no PostgreSQL
CHUNK_SIZE = 1000

# Função auxiliar para carregar o DataFrame no banco
def _load_dataframe(df: pd.DataFrame, table_name: str) -> None:
    print(f"\nCarregando {table_name} ({len(df):,} linhas)")
    start = time.time()
    
    df.to_sql(
        name=table_name,
        con=engine,
        if_exists="append",
        index=False,
        method="multi", 
        chunksize=CHUNK_SIZE,
    )

    elapsed = time.time() - start
    print(f"{table_name} carregado em {elapsed:.2f} segundos")

# Faz um check para saber se a tabela está vazia antes de carregar
def _check_table_empty(table_name: str) -> bool:
    with engine.connect() as conn:
        result = conn.execute(text(f"SELECT COUNT(*) FROM {table_name}"))
        count = result.scalar()
        return count == 0

# Define a ordem e qual func de transform usar para cada tabela
def run_load() -> None:
    pipeline = [
        ("sellers",        transform_sellers),
        ("customers",      transform_customers),
        ("products",       transform_products),
        ("orders",         transform_orders),
        ("order_items",    transform_order_items),
        ("order_payments", transform_order_payments),
        ("order_reviews",  transform_order_reviews),
    ]

    total_start = time.time()

    for table_name, transform_func in pipeline:
        if not _check_table_empty(table_name):
            print(f"\n  ⚠️  {table_name} já contém dados — pulando.")
            print(f"      Para recarregar, rode o script de reset do banco.")
            continue

        df = transform_func()

        _load_dataframe(df, table_name)

    total_elapsed = time.time() - total_start
    print(f"  CARGA FINALIZADA EM {total_elapsed:.2f}s".center(60))
    
if __name__ == "__main__":
    run_load()
