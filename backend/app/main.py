from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers.billing import router as billing_router

from app.routers.forecast import router as forecast_router


app = FastAPI(
    title="CloudSense AI API",
    description="Backend API for cloud cost optimization and anomaly detection",
    version="1.0.0",
)


# Allow React frontend to communicate with FastAPI backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Include Billing Router
app.include_router(billing_router)

# Include Forecast Router
app.include_router(forecast_router)


@app.get("/")
def root():
    return {
        "message": "CloudSense AI Backend is running",
        "status": "success",
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "CloudSense AI API",
    }