import pytest


from copy import deepcopy
from contextlib import asynccontextmanager
from fastapi import FastAPI
from pathlib import Path
from tortoise.contrib.fastapi import RegisterTortoise


from app.infrastructure.database.config import TORTOISE_ORM
from app.interfaces.http.routes.patients import router as patients_router

@pytest.fixture
def database_config(tmp_path: Path) -> dict:
    pytest_orm = deepcopy(TORTOISE_ORM)
    database_path = tmp_path / "test.sqlite3"
    pytest_orm["connections"]["default"] = f"sqlite://{database_path.as_posix()}"
    return pytest_orm


@pytest.fixture
def test_app(database_config: dict) -> FastAPI:
    @asynccontextmanager
    async def lifespan(app: FastAPI):
        async with RegisterTortoise(
            app = app,
            config = database_config,
            generate_schemas=True,
        ):
            yield

    app = FastAPI(
        lifespan=lifespan,
    )

    app.include_router(patients_router, prefix="/api")

    return app