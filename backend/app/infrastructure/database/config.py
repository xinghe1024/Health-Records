from app.core.config import settings


TORTOISE_ORM = {
    "connections": {"default": settings.database_url},
    "apps": {
    "models": {
        "models": ["app.infrastructure.database.models"],
        "default_connection": "default",
        "migrations": "app.infrastructure.database.migrations",
        }
    },
    "use_tz": True,
    "timezone": "UTC",
}
