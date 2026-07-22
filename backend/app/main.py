from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import Base, engine
from app.routers import auth_routes, prompt_routes, letter_routes, mood_routes

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Love Letters API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.frontend_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_routes.router)
app.include_router(prompt_routes.router)
app.include_router(letter_routes.router)
app.include_router(mood_routes.router)


@app.get("/health")
def health():
    return {"status": "ok"}
