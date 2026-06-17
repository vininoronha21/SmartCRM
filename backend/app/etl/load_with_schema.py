from app.database import engine
from app.etl.load import run_load
from app.models import Base


def main() -> None:
    print("Criando schema do banco, se necessário...")
    Base.metadata.create_all(bind=engine)
    run_load()


if __name__ == "__main__":
    main()
