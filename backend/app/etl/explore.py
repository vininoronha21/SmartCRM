# Script de exploração dos CSVs do Olist
# Objetivo: entender o estado real dos dados ANTES de limpar qualquer coisa

import pandas as pd
from pathlib import Path

# Config de diretórios
DATA_DIR = Path(__file__).resolve().parents[3] / "data"

DATASETS = {
  "customers":      "customers_dataset.csv",
  "orders":         "orders_dataset.csv",
  "order_items":    "order_items_dataset.csv",
  "order_payments": "order_payments_dataset.csv",
  "order_reviews":  "order_reviews_dataset.csv",
  "products":       "products_dataset.csv",
  "sellers":        "sellers_dataset.csv",
  "translations":   "product_category_name_translation.csv",
}

def explore_dataset(name: str, filename: str) -> None:
  filepath = DATA_DIR / filename

  if not filepath.exists():
    print(f"\n[ERRO] ARQUIVO NÃO ENCONTRADO: {filename}")
    print(f"Caminho tentado: {filepath}")
    return

  df = pd.read_csv(filepath, encoding="utf-8")
  linhas, colunas = df.shape

  # Separador visual
  print("\n" + "="*80)
  print(f" DATASET: {name.upper()} ".center(80, "#"))
  print(f" Arquivo: {filename}".center(80))
  print("="*80)

  # Informações gerais
  print(f"\nESTATÍSTICAS GERAIS:")
  print(f"- Total de Linhas:  {linhas:,}")
  print(f"- Total de Colunas: {colunas}")
  print(f"- Linhas Duplicadas: {df.duplicated().sum()}")

  # Análise de Colunas e Nulos
  print(f"\n{'COLUNA':<40} | {'TIPO':<15} | {'NULOS':<15}")
  print("-" * 80)
    
  # isnull().sum() → conta os NaN por coluna
  # Só mostra colunas que realmente têm nulos
  nulos = df.isnull().sum()
  nulos = nulos[nulos > 0]

  if nulos.empty:
    print("✅ Nenhum valor nulo")
  else:
    for col, qtd in nulos.sort_values(ascending=False).items():
      percentual = (qtd / linhas) * 100
      print(f"{col:<40} {qtd:>8,} ({percentual:5.1f}%)")

  # Amostra dos Dados
  print(f"\nAMOSTRA (2 primeiras linhas):")
  print("-" * 80)
  # .head() mas com formatação para não quebrar a linha no terminal se possível
  print(df.head(2).to_string(index=False))
  print("-" * 80)
  print("\n")

if __name__ == "__main__":
  print("\n" + "*"*80)
  print("INICIANDO EXPLORAÇÃO DOS DATASETS OLIST".center(80))
  print("*"*80)
    
  for name, filename in DATASETS.items():
    explore_dataset(name, filename)
        
  print("\n" + "="*80)
  print("EXPLORAÇÃO FINALIZADA".center(80))
  print("="*80 + "\n")
