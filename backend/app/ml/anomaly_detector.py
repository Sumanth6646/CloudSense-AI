import pandas as pd
from sklearn.ensemble import IsolationForest


def detect_anomalies(data: list[dict]):
    """
    Detect unusual cloud billing records using Isolation Forest.
    """

    dataframe = pd.DataFrame(data)

    if dataframe.empty:
        return []

    # Convert Cost to numeric
    dataframe["Cost"] = pd.to_numeric(
        dataframe["Cost"],
        errors="coerce",
    )

    # Remove invalid costs
    dataframe = dataframe.dropna(
        subset=["Cost"]
    ).copy()

    # Isolation Forest requires enough records
    if len(dataframe) < 5:
        return []

    # --------------------------------------------------
    # Prepare ML features
    # --------------------------------------------------

    dataframe["log_cost"] = (
        dataframe["Cost"].clip(lower=0).add(1).apply(
            lambda value: __import__("math").log(value)
        )
    )

    features = dataframe[
        ["Cost", "log_cost"]
    ]

    # --------------------------------------------------
    # Train Isolation Forest
    # --------------------------------------------------

    model = IsolationForest(
        n_estimators=100,
        contamination="auto",
        random_state=42,
    )

    model.fit(features)

    # Prediction:
    #  1  = normal
    # -1  = anomaly

    dataframe["prediction"] = model.predict(
        features
    )

    # Anomaly score
    dataframe["anomaly_score"] = (
        model.decision_function(features)
    )

    anomalies = dataframe[
        dataframe["prediction"] == -1
    ].copy()

    if anomalies.empty:
        return []

    # --------------------------------------------------
    # Determine severity
    # --------------------------------------------------

    cost_values = dataframe["Cost"]

    q75 = cost_values.quantile(0.75)
    q90 = cost_values.quantile(0.90)
    q97 = cost_values.quantile(0.97)

    results = []

    for _, row in anomalies.iterrows():

        cost = float(row["Cost"])

        if cost >= q97:
            severity = "Critical"
        elif cost >= q90:
            severity = "High"
        elif cost >= q75:
            severity = "Medium"
        else:
            severity = "Low"

        results.append({
            "Date": row.get("Date", ""),
            "Provider": row.get(
                "Provider",
                "Unknown",
            ),
            "Service": row.get(
                "Service",
                "Unknown",
            ),
            "Region": row.get(
                "Region",
                "Unknown",
            ),
            "Cost": round(cost, 2),
            "anomaly_score": round(
                float(row["anomaly_score"]),
                4,
            ),
            "severity": severity,
            "status": "Open",
        })

    # Highest-cost anomalies first
    results.sort(
        key=lambda item: item["Cost"],
        reverse=True,
    )

    return results