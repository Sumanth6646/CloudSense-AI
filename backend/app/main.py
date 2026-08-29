from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers.billing import router as billing_router
from app.routers.forecast import router as forecast_router
from app.routers.recommendations import router as recommendations_router
#from app.routers.anomaly import router as anomaly_router


app = FastAPI(
    title="CloudSense AI API",
    description=(
        "Backend API for cloud cost optimization, "
        "anomaly detection, forecasting, and recommendations"
    ),
    version="1.0.0",
)


# --------------------------------------------------
# CORS Configuration
# --------------------------------------------------

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


# --------------------------------------------------
# API Routers
# --------------------------------------------------

app.include_router(billing_router)
app.include_router(forecast_router)
app.include_router(recommendations_router)
#app.include_router(anomaly_router)


# --------------------------------------------------
# Root Endpoint
# --------------------------------------------------

@app.get("/")
def root():
    return {
        "message": "CloudSense AI Backend is running",
        "status": "success",
    }


# --------------------------------------------------
# Health Check
# --------------------------------------------------

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "CloudSense AI API",
    }