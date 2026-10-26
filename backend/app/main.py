import uvicorn
from fastapi import FastAPI


from app.interfaces.http.routes.patients import router as patients_router
from app.infrastructure.database.lifecycle import (
    check_database_connection,
    database_lifespan,
)



app = FastAPI(title="糖护智伴 API", lifespan=database_lifespan)
app.include_router(patients_router, prefix="/api")


@app.get("/api/health", tags=["健康检查"])
async def health_check() -> dict[str, str]:
    """检查应用和数据库是否正常工作。"""

    await check_database_connection()
    return {"status": "ok", "database": "ok"}


if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="127.0.0.1",
        port=8000,
        reload=True,
    )


