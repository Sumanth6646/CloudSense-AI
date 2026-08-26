from fastapi import APIRouter, HTTPException

from app.ml.anomaly_detector import detect_anomalies


router = APIRouter(
    prefix="/api/anomaly",
    tags=["Anomaly Detection"],
)


@router.post("/detect")
async def detect_billing_anomalies(
    data: list[dict],
):
    """
    Detect billing anomalies using
    the Isolation Forest ML model.
    """

    if not data:
        raise HTTPException(
            status_code=400,
            detail="No billing data provided.",
        )

    try:

        anomalies = detect_anomalies(data)

        return {
            "status": "success",
            "model": "Isolation Forest",
            "total_records": len(data),
            "anomaly_count": len(anomalies),
            "anomalies": anomalies,
        }

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=(
                f"Unable to detect anomalies: "
                f"{str(error)}"
            ),
        )