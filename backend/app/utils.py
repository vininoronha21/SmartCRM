from datetime import UTC, datetime


def make_response(data):
    return {"data": data, "meta": {"generated_at": datetime.now(UTC).isoformat()}}
