# Script para transformar os dados (OBS: Este arquivo NÃO acessa o banco, só trabalha com dados em memória)
# Objetivo: ler os CSVs brutos e devolver DataFrames limpos e tipados

from pathlib import Path

import pandas as pd

DATA_DIR = Path(__file__).resolve().parents[3] / "data"


# Função interna (prefixo _) — só usada dentro deste arquivo.
def _read_csv(filename: str) -> pd.DataFrame:
    filepath = DATA_DIR / filename
    return pd.read_csv(filepath, encoding="utf-8")


# Padroniza seller_city para minúsculo e sem espaços extras
# Exemplo: 'Campinas' e 'campinas'
def transform_sellers() -> pd.DataFrame:
    df = _read_csv("sellers_dataset.csv")

    df = df.rename(
        columns={
            "seller_zip_code_prefix": "zip_code_prefix",
            "seller_city": "city",
            "seller_state": "state",
        }
    )

    df["city"] = df["city"].str.lower().str.strip()
    df["state"] = df["state"].str.upper().str.strip()

    return df


# Padroniza customer_city para minúsculo
def transform_customers() -> pd.DataFrame:
    df = _read_csv("customers_dataset.csv")

    df = df.rename(
        columns={
            "customer_zip_code_prefix": "zip_code_prefix",
            "customer_city": "city",
            "customer_state": "state",
        }
    )

    df["city"] = df["city"].str.lower().str.strip()
    return df


# Limpa e padroniza o dataset de products
def transform_products() -> pd.DataFrame:
    df = _read_csv("products_dataset.csv")
    df["product_category_name"] = df["product_category_name"].fillna("unknown")

    # Int64 = inteiro que aceita nulos no pandas
    for col in ["product_name_lenght", "product_description_lenght"]:
        df[col] = df[col].astype("Int64")

    df = df[
        [
            "product_id",
            "product_category_name",
            "product_name_lenght",
            "product_description_lenght",
        ]
    ]
    df = df.rename(
        columns={
            "product_category_name": "category_name",
            "product_name_lenght": "name_length",
            "product_description_lenght": "description_length",
        }
    )

    return df


# Converte todas as colunas de data para datetime
def transform_orders() -> pd.DataFrame:
    df = _read_csv("orders_dataset.csv")

    df = df.rename(
        columns={
            "order_status": "status",
            "order_purchase_timestamp": "purchase_timestamp",
            "order_approved_at": "approved_at",
            "order_delivered_carrier_date": "delivered_carrier_date",
            "order_delivered_customer_date": "delivered_customer_date",
            "order_estimated_delivery_date": "estimated_delivery_date",
        }
    )

    date_cols = [
        "purchase_timestamp",
        "approved_at",
        "delivered_carrier_date",
        "delivered_customer_date",
        "estimated_delivery_date",
    ]

    # errors="coerce". Se encontrar uma data inválida, converte para NaT
    for col in date_cols:
        df[col] = pd.to_datetime(df[col], errors="coerce")

    return df


# Retorna apenas as colunas mapeadas no banco de dados (remove shipping_limit_date)
def transform_order_items() -> pd.DataFrame:
    df = _read_csv("order_items_dataset.csv")

    df = df[
        [
            "order_id",
            "order_item_id",
            "product_id",
            "seller_id",
            "price",
            "freight_value",
        ]
    ]

    return df


# SEM transformações necessárias (dados já estão limpos e bem tipados)
# Função mantida para consistência: o load.py chama transform para todos os datasets
def transform_order_payments() -> pd.DataFrame:
    df = _read_csv("order_payments_dataset.csv")

    return df


# Nulos em review_comment_title e _message são mantidos. Comentários são opcionais
def transform_order_reviews() -> pd.DataFrame:
    df = _read_csv("order_reviews_dataset.csv")

    df = df.drop_duplicates(subset=["review_id"])

    date_cols = [
        "review_creation_date",
        "review_answer_timestamp",
    ]

    for col in date_cols:
        df[col] = pd.to_datetime(df[col], errors="coerce")

    return df


# Ponto de entrada para teste manual
# Permite rodar: python/backend/app/etl/transform.py
# e ver um resumo de cada DataFrame transformando antes de carregar no banco
if __name__ == "__main__":
    transforms = {
        "sellers": transform_sellers,
        "customers": transform_customers,
        "products": transform_products,
        "orders": transform_orders,
        "order_items": transform_order_items,
        "order_payments": transform_order_payments,
        "order_reviews": transform_order_reviews,
    }

    for name, func in transforms.items():
        df = func()
        print(f"\n{'=' * 80}")
        print(f"{name.upper()}: {df.shape[0]:,} linhas × {df.shape[1]} colunas")
        print(f"Tipos: {df.dtypes.to_dict()}")
        print(f"Nulos restantes: {df.isnull().sum().to_dict()}")
