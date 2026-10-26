from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI
from tortoise import Tortoise
from tortoise.contrib.fastapi import RegisterTortoise

from app.infrastructure.database.config import TORTOISE_ORM


async def check_database_connection() -> None:
    """执行最小查询，确认数据库能够响应。"""

    connection = Tortoise.get_connection("default")
    await connection.execute_query("SELECT 1")


@asynccontextmanager
async def database_lifespan(app: FastAPI) -> AsyncIterator[None]:
    """管理数据库连接生命周期，启动失败时及时暴露问题。"""

    async with RegisterTortoise(
        app=app,
        config=TORTOISE_ORM,
        generate_schemas=False,
    ):
        await check_database_connection()
        yield
