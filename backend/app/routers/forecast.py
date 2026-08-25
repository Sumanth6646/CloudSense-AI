from fastapi import APIRouter, HTTPException
import pandas as pd

router = APIRouter(
    prefix="/api/forecast",
    tags=["Forecast"],
)


@router.post("/predict")
async def predict_costs(data: list[dict]):
    """
    Predict future cloud costs using a simple
    moving-average forecasting approach.
    """

    if not data:
        raise HTTPException(
            status_code=400,
            detail="No billing data provided.",
        )

    try:
        dataframe = pd.DataFrame(data)

        if "Date" not in dataframe.columns:
            raise HTTPException(
                status_code=400,
                detail="Billing data must contain a Date column.",
            )

        if "Cost" not in dataframe.columns:
            raise HTTPException(
                status_code=400,
                detail="Billing data must contain a Cost column.",
            )

        # Convert values
        dataframe["Date"] = pd.to_datetime(
            dataframe["Date"],
            errors="coerce",
        )

        dataframe["Cost"] = pd.to_numeric(
            dataframe["Cost"],
            errors="coerce",
        )

        # Remove invalid records
        dataframe = dataframe.dropna(
            subset=["Date", "Cost"]
        )

        if len(dataframe) < 3:
            raise HTTPException(
                status_code=400,
                detail="At least 3 billing records are required for forecasting.",
            )

        # Aggregate cost by date
        daily_cost = (
            dataframe.groupby("Date")["Cost"]
            .sum()
            .sort_index()
        )

        if len(daily_cost) < 3:
            raise HTTPException(
                status_code=400,
                detail="At least 3 different dates are required for forecasting.",
            )

        # Use the last 7 days when available
        window = min(7, len(daily_cost))

        recent_costs = daily_cost.tail(window)

        average_cost = float(recent_costs.mean())

        # Calculate recent trend
        if len(recent_costs) >= 2:
            first_value = float(recent_costs.iloc[0])
            last_value = float(recent_costs.iloc[-1])

            if first_value > 0:
                trend_percentage = (
                    (last_value - first_value)
                    / first_value
                ) * 100
            else:
                trend_percentage = 0
        else:
            trend_percentage = 0

        # Limit extreme trend values
        trend_factor = max(
            0.5,
            min(1.5, 1 + trend_percentage / 100),
        )

        # Predict next 7 days
        last_date = daily_cost.index[-1]

        forecast = []

        for day in range(1, 8):

            predicted_cost = (
                average_cost
                * (trend_factor ** (day / 7))
            )

            forecast_date = (
                last_date
                + pd.Timedelta(days=day)
            )

            forecast.append(
                {
                    "date": forecast_date.strftime(
                        "%Y-%m-%d"
                    ),
                    "predicted_cost": round(
                        float(predicted_cost),
                        2,
                    ),
                }
            )

        total_predicted_cost = sum(
            item["predicted_cost"]
            for item in forecast
        )

        return {
            "status": "success",
            "forecast_period": "7 days",
            "historical_days": len(daily_cost),
            "average_daily_cost": round(
                average_cost,
                2,
            ),
            "trend_percentage": round(
                trend_percentage,
                2,
            ),
            "predicted_total": round(
                total_predicted_cost,
                2,
            ),
            "forecast": forecast,
        }

    except HTTPException:
        raise

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Unable to generate forecast: {str(error)}",
        )