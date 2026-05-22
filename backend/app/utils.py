from datetime import datetime, timezone


def make_response(data):
    """Wrapper padrão para todos os endpoints da API."""
    return {
        "data": data,
        "meta": {"generated_at": datetime.now(timezone.utc).isoformat()}
    }
