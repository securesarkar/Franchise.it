from fastapi import FastAPI

from api.routes import router as match_router

app = FastAPI(title="Franchise Matcher API")
app.include_router(match_router)


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}
