from fastapi import APIRouter, UploadFile, File, HTTPException
import pandas as pd
from io import BytesIO

from app.ml.anomaly_detector import detect_anomalies


router = APIRouter(
    prefix="/api/billing",
    tags=["Billing"],
)


REQUIRED_COLUMNS = [
    "Date",
    "Provider",
    "Service",
    "Region",
    "Usage",
    "Unit",
    "Cost",
]


@router.post("/upload")
async def upload_billing_file(
    file: UploadFile = File(...)
):
    # ---------------------------------------------
    # Check file type
    # ---------------------------------------------

    if not file.filename.lower().endswith(".csv"):
        raise HTTPException(
            status_code=400,
            detail="Only CSV files are supported.",
        )

    try:
        # ---------------------------------------------
        # Read uploaded file
        # ---------------------------------------------

        contents = await file.read()

        if not contents:
            raise HTTPException(
                status_code=400,
                detail="The uploaded file is empty.",
            )

        # ---------------------------------------------
        # Convert CSV to DataFrame
        # ---------------------------------------------

        dataframe = pd.read_csv(
            BytesIO(contents)
        )

        # ---------------------------------------------
        # Check required columns
        # ---------------------------------------------

        missing_columns = [
            column
            for column in REQUIRED_COLUMNS
            if column not in dataframe.columns
        ]

        if missing_columns:
            raise HTTPException(
                status_code=400,
                detail={
                    "message": "Invalid billing CSV format.",
                    "missing_columns": missing_columns,
                },
            )

        # ---------------------------------------------
        # Clean numeric values
        # ---------------------------------------------

        dataframe["Cost"] = pd.to_numeric(
            dataframe["Cost"],
            errors="coerce",
        )

        dataframe["Usage"] = pd.to_numeric(
            dataframe["Usage"],
            errors="coerce",
        )

        # ---------------------------------------------
        # Remove invalid rows
        # ---------------------------------------------

        dataframe = dataframe.dropna(
            subset=["Cost", "Usage"]
        ).copy()

        if dataframe.empty:
            raise HTTPException(
                status_code=400,
                detail="No valid billing records found.",
            )

        # ---------------------------------------------
        # Calculate total cost
        # ---------------------------------------------

        total_cost = float(
            dataframe["Cost"].sum()
        )

        # ---------------------------------------------
        # Number of records
        # ---------------------------------------------

        record_count = len(dataframe)

        # ---------------------------------------------
        # Provider summary
        # ---------------------------------------------

        provider_summary = (
            dataframe.groupby("Provider")["Cost"]
            .sum()
            .to_dict()
        )

        # ---------------------------------------------
        # Service summary
        # ---------------------------------------------

        service_summary = (
            dataframe.groupby("Service")["Cost"]
            .sum()
            .to_dict()
        )

        # ---------------------------------------------
        # Run Isolation Forest
        # ---------------------------------------------

        billing_records = dataframe.to_dict(
            orient="records"
        )

        anomalies = detect_anomalies(
            billing_records
        )

        # ---------------------------------------------
        # Return complete response
        # ---------------------------------------------

        return {
            "status": "success",
            "message": "Billing CSV processed successfully.",
            "filename": file.filename,

            "records": record_count,

            "total_cost": total_cost,

            "provider_summary": provider_summary,

            "service_summary": service_summary,

            # Original billing records
            "data": billing_records,

            # Isolation Forest results
            "anomalies": anomalies,

            "anomaly_count": len(anomalies),

            "model": "Isolation Forest",
        }

    except HTTPException:
        raise

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=(
                "Unable to process billing file: "
                f"{str(error)}"
            ),
        )