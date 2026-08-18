from fastapi import FastAPI

app = FastAPI(
    title="CloudSense AI API",
    description="Backend API for cloud cost optimization and anomaly detection",
    version="1.0.0",
)


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