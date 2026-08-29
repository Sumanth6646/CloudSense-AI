import math

import pandas as pd
from sklearn.ensemble import IsolationForest


def detect_anomalies(data):
    """
    Detect unusual cloud billing records using Isolation Forest.

    The model considers:
    - Cost
    - Usage
    - Cost per unit of usage

    A small fallback rule is used so that clear billing spikes
    are not missed when Isolation Forest produces no anomalies.
    """

    # --------------------------------------------------
    # Convert input to DataFrame
    # --------------------------------------------------

    if isinstance(data, pd.DataFrame):
        dataframe = data.copy()
    elif isinstance(data, list):
        dataframe = pd.DataFrame(data)
    else:
        return []

    if dataframe.empty:
        return []

    # --------------------------------------------------
    # Validate Cost and Usage
    # --------------------------------------------------

    if "Cost" not in dataframe.columns:
        return []

    dataframe["Cost"] = pd.to_numeric(
        dataframe["Cost"],
        errors="coerce",
    )

    if "Usage" in dataframe.columns:
        dataframe["Usage"] = pd.to_numeric(
            dataframe["Usage"],
            errors="coerce",
        )
    else:
        dataframe["Usage"] = 0

    dataframe = dataframe.dropna(
        subset=["Cost"]
    ).copy()

    if dataframe.empty:
        return []

    # --------------------------------------------------
    # Need enough records for Isolation Forest
    # --------------------------------------------------

    if len(dataframe) < 5:
        return []

    # --------------------------------------------------
    # Create ML features
    # --------------------------------------------------

    dataframe["safe_usage"] = dataframe["Usage"].clip(
        lower=0
    )

    dataframe["cost_per_usage"] = (
        dataframe["Cost"]
        / dataframe["safe_usage"].replace(0, 1)
    )

    dataframe["log_cost"] = dataframe["Cost"].clip(
        lower=0
    ).apply(
        lambda value: math.log1p(value)
    )

    dataframe["log_usage"] = dataframe[
        "safe_usage"
    ].apply(
        lambda value: math.log1p(value)
    )

    features = dataframe[
        [
            "Cost",
            "log_cost",
            "safe_usage",
            "log_usage",
            "cost_per_usage",
        ]
    ].fillna(0)

    # --------------------------------------------------
    # Isolation Forest
    # --------------------------------------------------

    model = IsolationForest(
        n_estimators=200,
        contamination=0.10,
        random_state=42,
        n_jobs=-1,
    )

    model.fit(features)

    dataframe["prediction"] = model.predict(
        features
    )

    dataframe["anomaly_score"] = (
        model.decision_function(features)
    )

    # --------------------------------------------------
    # Get ML anomalies
    # --------------------------------------------------

    anomalies = dataframe[
        dataframe["prediction"] == -1
    ].copy()

    # --------------------------------------------------
    # Fallback for obvious cost spikes
    #
    # This prevents the ML model from missing an
    # unusually expensive billing record.
    # --------------------------------------------------

    median_cost = float(
        dataframe["Cost"].median()
    )

    q75 = float(
        dataframe["Cost"].quantile(0.75)
    )

    q90 = float(
        dataframe["Cost"].quantile(0.90)
    )

    # A record significantly above normal spending
    # is treated as an anomaly.
    spike_threshold = max(
        q90,
        median_cost * 1.5,
    )

    spike_anomalies = dataframe[
        dataframe["Cost"] >= spike_threshold
    ].copy()

    # Combine ML anomalies and obvious spikes
    anomaly_indices = set(
        anomalies.index
    ).union(
        set(spike_anomalies.index)
    )

    if not anomaly_indices:
        return []

    anomalies = dataframe.loc[
        list(anomaly_indices)
    ].copy()

    # --------------------------------------------------
    # Severity thresholds
    # --------------------------------------------------

    q97 = float(
        dataframe["Cost"].quantile(0.97)
    )

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

        results.append(
            {
                "Date": str(
                    row.get("Date", "")
                ),

                "Provider": str(
                    row.get(
                        "Provider",
                        "Unknown",
                    )
                ),

                "Service": str(
                    row.get(
                        "Service",
                        "Unknown",
                    )
                ),

                "Region": str(
                    row.get(
                        "Region",
                        "Unknown",
                    )
                ),

                "Cost": round(
                    cost,
                    2,
                ),

                "anomaly_score": round(
                    float(
                        row.get(
                            "anomaly_score",
                            0,
                        )
                    ),
                    4,
                ),

                "severity": severity,

                "status": "Open",
            }
        )

    # --------------------------------------------------
    # Highest-cost anomalies first
    # --------------------------------------------------

    results.sort(
        key=lambda item: item["Cost"],
        reverse=True,
    )

    return results