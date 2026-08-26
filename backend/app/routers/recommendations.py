from fastapi import APIRouter, HTTPException
import pandas as pd

router = APIRouter(
    prefix="/api/recommendations",
    tags=["Recommendations"],
)


@router.post("/generate")
async def generate_recommendations(data: list[dict]):
    """
    Generate cloud cost optimization recommendations
    from uploaded billing data.
    """

    if not data:
        raise HTTPException(
            status_code=400,
            detail="No billing data provided.",
        )

    try:
        dataframe = pd.DataFrame(data)

        required_columns = [
            "Provider",
            "Service",
            "Cost",
        ]

        missing_columns = [
            column
            for column in required_columns
            if column not in dataframe.columns
        ]

        if missing_columns:
            raise HTTPException(
                status_code=400,
                detail={
                    "message": "Invalid billing data.",
                    "missing_columns": missing_columns,
                },
            )

        dataframe["Cost"] = pd.to_numeric(
            dataframe["Cost"],
            errors="coerce",
        )

        dataframe = dataframe.dropna(
            subset=["Cost"]
        )

        if dataframe.empty:
            raise HTTPException(
                status_code=400,
                detail="No valid cost records found.",
            )

        recommendations = []

        # --------------------------------------------------
        # 1. Service-level cost analysis
        # --------------------------------------------------

        service_costs = (
            dataframe.groupby("Service")["Cost"]
            .sum()
            .sort_values(ascending=False)
        )

        total_cost = float(
            dataframe["Cost"].sum()
        )

        # --------------------------------------------------
        # 2. High-cost service recommendation
        # --------------------------------------------------

        for service, cost in service_costs.items():

            percentage = (
                float(cost) / total_cost * 100
                if total_cost > 0
                else 0
            )

            if percentage >= 40:

                estimated_savings = float(cost) * 0.15

                recommendations.append({
                    "title": f"Optimize {service} spending",
                    "description": (
                        f"{service} accounts for "
                        f"{percentage:.1f}% of total cloud spending. "
                        "Review resource sizing, utilization, "
                        "and unnecessary running resources."
                    ),
                    "priority": "High",
                    "savings": round(
                        estimated_savings,
                        2,
                    ),
                    "service": service,
                    "reason": "High service cost concentration",
                })

        # --------------------------------------------------
        # 3. Low-cost / fragmented services
        # --------------------------------------------------

        for service, cost in service_costs.items():

            percentage = (
                float(cost) / total_cost * 100
                if total_cost > 0
                else 0
            )

            if 5 <= percentage < 10:

                estimated_savings = float(cost) * 0.10

                recommendations.append({
                    "title": f"Review {service} usage",
                    "description": (
                        f"{service} represents "
                        f"{percentage:.1f}% of total spending. "
                        "Review usage patterns and remove "
                        "unused resources where possible."
                    ),
                    "priority": "Medium",
                    "savings": round(
                        estimated_savings,
                        2,
                    ),
                    "service": service,
                    "reason": "Potential optimization opportunity",
                })

        # --------------------------------------------------
        # 4. Overall spending recommendation
        # --------------------------------------------------

        if total_cost > 0:

            overall_savings = total_cost * 0.05

            recommendations.append({
                "title": "Review overall cloud utilization",
                "description": (
                    "Analyze idle resources, unused storage, "
                    "and underutilized services across your "
                    "cloud environment."
                ),
                "priority": "Medium",
                "savings": round(
                    overall_savings,
                    2,
                ),
                "service": "All Services",
                "reason": "General cost optimization",
            })

        # --------------------------------------------------
        # 5. Sort recommendations
        # --------------------------------------------------

        priority_order = {
            "High": 1,
            "Medium": 2,
            "Low": 3,
        }

        recommendations.sort(
            key=lambda item: (
                priority_order.get(
                    item["priority"],
                    3,
                ),
                -item["savings"],
            )
        )

        # Limit results
        recommendations = recommendations[:6]

        total_savings = sum(
            item["savings"]
            for item in recommendations
        )

        return {
            "status": "success",
            "total_cost": round(
                total_cost,
                2,
            ),
            "total_potential_savings": round(
                total_savings,
                2,
            ),
            "recommendation_count": len(
                recommendations
            ),
            "recommendations": recommendations,
        }

    except HTTPException:
        raise

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=(
                f"Unable to generate recommendations: "
                f"{str(error)}"
            ),
        )