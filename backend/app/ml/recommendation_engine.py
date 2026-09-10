import pandas as pd


# --------------------------------------------------
# Recommendation Engine
# --------------------------------------------------

def generate_recommendations(data):
    """
    Generate cloud cost optimization recommendations
    from billing records.

    The engine analyzes:
    - Service-level spending
    - Cost concentration
    - Cloud resource categories
    - Usage patterns
    - Overall cloud spending

    The recommendations are deterministic and
    explainable so that the user can understand
    why each recommendation was generated.
    """

    # --------------------------------------------------
    # Convert input to DataFrame
    # --------------------------------------------------

    if isinstance(data, pd.DataFrame):
        dataframe = data.copy()

    elif isinstance(data, list):
        dataframe = pd.DataFrame(data)

    else:
        return {
            "recommendations": [],
            "total_potential_savings": 0.0,
            "total_cost": 0.0,
        }

    if dataframe.empty:
        return {
            "recommendations": [],
            "total_potential_savings": 0.0,
            "total_cost": 0.0,
        }

    # --------------------------------------------------
    # Validate required columns
    # --------------------------------------------------

    required_columns = [
        "Service",
        "Cost",
    ]

    for column in required_columns:
        if column not in dataframe.columns:
            return {
                "recommendations": [],
                "total_potential_savings": 0.0,
                "total_cost": 0.0,
            }

    # --------------------------------------------------
    # Clean numeric values
    # --------------------------------------------------

    dataframe["Cost"] = pd.to_numeric(
        dataframe["Cost"],
        errors="coerce",
    )

    dataframe = dataframe.dropna(
        subset=["Cost"]
    ).copy()

    if dataframe.empty:
        return {
            "recommendations": [],
            "total_potential_savings": 0.0,
            "total_cost": 0.0,
        }

    # --------------------------------------------------
    # Clean service names
    # --------------------------------------------------

    dataframe["Service"] = (
        dataframe["Service"]
        .fillna("Unknown Service")
        .astype(str)
        .str.strip()
    )

    # --------------------------------------------------
    # Calculate total cost
    # --------------------------------------------------

    total_cost = float(
        dataframe["Cost"].sum()
    )

    if total_cost <= 0:
        return {
            "recommendations": [],
            "total_potential_savings": 0.0,
            "total_cost": 0.0,
        }

    # --------------------------------------------------
    # Service-level cost analysis
    # --------------------------------------------------

    service_costs = (
        dataframe.groupby("Service")["Cost"]
        .sum()
        .sort_values(ascending=False)
    )

    recommendations = []

    # --------------------------------------------------
    # Resource categories
    # --------------------------------------------------

    compute_services = {
        "EC2",
        "Compute Engine",
        "Virtual Machines",
        "VM",
        "Virtual Machine",
    }

    storage_services = {
        "S3",
        "Storage",
        "Cloud Storage",
        "Blob Storage",
    }

    database_services = {
        "RDS",
        "Cloud SQL",
        "Database",
        "Databases",
    }

    # --------------------------------------------------
    # Track services already recommended
    # --------------------------------------------------

    recommended_services = set()

    # --------------------------------------------------
    # Analyze each service
    # --------------------------------------------------

    for service, cost in service_costs.items():

        service_name = str(service)

        service_cost = float(cost)

        percentage = (
            service_cost / total_cost
        ) * 100

        normalized_name = service_name.strip()

        # --------------------------------------------------
        # Compute optimization
        # --------------------------------------------------

        if normalized_name in compute_services:

            if percentage >= 10:

                estimated_savings = (
                    service_cost * 0.10
                )

                recommendations.append({
                    "title": (
                        f"Optimize {service_name} "
                        "resources"
                    ),

                    "description": (
                        f"{service_name} represents "
                        f"{percentage:.1f}% of total cloud "
                        "spending. Review instance sizing, "
                        "CPU and memory utilization, and "
                        "unused compute resources."
                    ),

                    "priority": (
                        "High"
                        if percentage >= 20
                        else "Medium"
                    ),

                    "savings": round(
                        estimated_savings,
                        2,
                    ),

                    "service": service_name,

                    "reason": (
                        "High compute cost concentration"
                    ),
                })

                recommended_services.add(
                    normalized_name
                )

        # --------------------------------------------------
        # Storage optimization
        # --------------------------------------------------

        elif normalized_name in storage_services:

            if percentage >= 5:

                estimated_savings = (
                    service_cost * 0.08
                )

                recommendations.append({
                    "title": (
                        f"Optimize {service_name} "
                        "storage"
                    ),

                    "description": (
                        f"{service_name} accounts for "
                        f"{percentage:.1f}% of total cloud "
                        "spending. Review unused storage, "
                        "old objects, storage tiers, and "
                        "lifecycle policies."
                    ),

                    "priority": (
                        "High"
                        if percentage >= 15
                        else "Medium"
                    ),

                    "savings": round(
                        estimated_savings,
                        2,
                    ),

                    "service": service_name,

                    "reason": (
                        "Storage optimization opportunity"
                    ),
                })

                recommended_services.add(
                    normalized_name
                )

        # --------------------------------------------------
        # Database optimization
        # --------------------------------------------------

        elif normalized_name in database_services:

            if percentage >= 5:

                estimated_savings = (
                    service_cost * 0.10
                )

                recommendations.append({
                    "title": (
                        f"Optimize {service_name} "
                        "database usage"
                    ),

                    "description": (
                        f"{service_name} represents "
                        f"{percentage:.1f}% of total cloud "
                        "spending. Review database "
                        "utilization, instance sizing, "
                        "and unused database resources."
                    ),

                    "priority": (
                        "High"
                        if percentage >= 10
                        else "Medium"
                    ),

                    "savings": round(
                        estimated_savings,
                        2,
                    ),

                    "service": service_name,

                    "reason": (
                        "Database cost optimization"
                    ),
                })

                recommended_services.add(
                    normalized_name
                )

        # --------------------------------------------------
        # General high-cost service
        # --------------------------------------------------

        elif percentage >= 15:

            estimated_savings = (
                service_cost * 0.10
            )

            recommendations.append({
                "title": (
                    f"Review {service_name} "
                    "spending"
                ),

                "description": (
                    f"{service_name} accounts for "
                    f"{percentage:.1f}% of total cloud "
                    "spending. Investigate utilization, "
                    "resource sizing, and unnecessary "
                    "running resources."
                ),

                "priority": (
                    "High"
                    if percentage >= 25
                    else "Medium"
                ),

                "savings": round(
                    estimated_savings,
                    2,
                ),

                "service": service_name,

                "reason": (
                    "High service cost concentration"
                ),
            })

            recommended_services.add(
                normalized_name
            )

    # --------------------------------------------------
    # Analyze usage when available
    # --------------------------------------------------

    if "Usage" in dataframe.columns:

        dataframe["Usage"] = pd.to_numeric(
            dataframe["Usage"],
            errors="coerce",
        )

        valid_usage = dataframe.dropna(
            subset=["Usage"]
        )

        if not valid_usage.empty:

            total_usage = float(
                valid_usage["Usage"].sum()
            )

            if total_usage > 0:

                high_usage_cost = float(
                    valid_usage.loc[
                        valid_usage["Usage"]
                        >= valid_usage["Usage"].quantile(
                            0.75
                        ),
                        "Cost",
                    ].sum()
                )

                high_usage_percentage = (
                    high_usage_cost
                    / total_cost
                ) * 100

                if high_usage_percentage >= 30:

                    estimated_savings = (
                        high_usage_cost * 0.05
                    )

                    recommendations.append({
                        "title": (
                            "Review high-usage "
                            "resources"
                        ),

                        "description": (
                            f"Resources in the upper "
                            "usage range account for "
                            f"{high_usage_percentage:.1f}% "
                            "of total spending. Review "
                            "resource utilization and "
                            "consider rightsizing."
                        ),

                        "priority": "Medium",

                        "savings": round(
                            estimated_savings,
                            2,
                        ),

                        "service": "Multiple Services",

                        "reason": (
                            "High usage concentration"
                        ),
                    })

    # --------------------------------------------------
    # Overall cloud optimization
    #
    # Only add this when there are not enough
    # service-specific recommendations.
    # --------------------------------------------------

    if len(recommendations) < 2:

        overall_savings = (
            total_cost * 0.05
        )

        recommendations.append({
            "title": (
                "Review overall cloud utilization"
            ),

            "description": (
                "Analyze idle resources, unused "
                "storage, underutilized services, "
                "and unnecessary running resources "
                "across the cloud environment."
            ),

            "priority": "Medium",

            "savings": round(
                overall_savings,
                2,
            ),

            "service": "All Services",

            "reason": (
                "General cost optimization"
            ),
        })

    # --------------------------------------------------
    # Remove duplicate service recommendations
    # --------------------------------------------------

    unique_recommendations = []

    seen = set()

    for recommendation in recommendations:

        key = (
            recommendation["service"],
            recommendation["title"],
        )

        if key not in seen:

            unique_recommendations.append(
                recommendation
            )

            seen.add(key)

    recommendations = unique_recommendations

    # --------------------------------------------------
    # Sort by priority and savings
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

    # --------------------------------------------------
    # Limit recommendations
    # --------------------------------------------------

    recommendations = recommendations[:6]

    # --------------------------------------------------
    # Calculate total potential savings
    # --------------------------------------------------

    total_savings = sum(
        float(item["savings"])
        for item in recommendations
    )

    # Prevent the estimated savings from becoming
    # unrealistic compared with total spending.
    maximum_savings = total_cost * 0.25

    total_savings = min(
        total_savings,
        maximum_savings,
    )

    return {
        "recommendations": recommendations,
        "total_potential_savings": round(
            total_savings,
            2,
        ),
        "total_cost": round(
            total_cost,
            2,
        ),
    }