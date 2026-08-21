from fastapi import FastAPI
from app.routers.billing import router as billing_router


app = FastAPI(
    title="CloudSense AI API",
    description="Backend API for cloud cost optimization and anomaly detection",
    version="1.0.0",
)


# Include Billing Router
app.include_router(billing_router)


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