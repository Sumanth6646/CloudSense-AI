from fastapi import APIRouter, HTTPException

from app.ml.recommendation_engine import (
    generate_recommendations,
)


router = APIRouter(
    prefix="/api/recommendations",
    tags=["Recommendations"],
)


@router.post("/generate")
async def generate_cloud_recommendations(
    data: list[dict],
):
    """
    Generate cloud cost optimization
    recommendations from billing data.
    """

    # --------------------------------------------------
    # Validate input
    # --------------------------------------------------

    if not data:

        raise HTTPException(
            status_code=400,
            detail="No billing data provided.",
        )

    try:

        # --------------------------------------------------
        # Generate recommendations
        # --------------------------------------------------

        result = generate_recommendations(
            data
        )

        recommendations = result.get(
            "recommendations",
            [],
        )

        total_savings = result.get(
            "total_potential_savings",
            0,
        )

        total_cost = result.get(
            "total_cost",
            0,
        )

        # --------------------------------------------------
        # API Response
        # --------------------------------------------------

        return {
            "status": "success",

            "total_cost": round(
                float(total_cost),
                2,
            ),

            "total_potential_savings": round(
                float(total_savings),
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
                "Unable to generate recommendations: "
                f"{str(error)}"
            ),
        )