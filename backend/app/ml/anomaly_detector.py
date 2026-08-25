import pandas as pd
from sklearn.ensemble import IsolationForest


def detect_anomalies(dataframe: pd.DataFrame):
    """
    Detect unusual cloud billing records using Isolation Forest.
    """

    if dataframe.empty:
        return dataframe.copy()

    data = dataframe.copy()

    # Make sure Cost is numeric
    data["Cost"] = pd.to_numeric(
        data["Cost"],
        errors="coerce"
    )

    # Remove invalid cost values
    data = data.dropna(subset=["Cost"]).copy()

    if len(data) < 5:
        data["anomaly"] = 0
        data["anomaly_score"] = 0.0
        return data

    # Feature used by the initial model
    features = data[["Cost"]]

    # Create Isolation Forest model
    model = IsolationForest(
        contamination=0.10,
        random_state=42
    )

    # Train and predict
    predictions = model.fit_predict(features)

    # Anomaly score
    scores = model.decision_function(features)

    # Isolation Forest:
    #  1  = normal
    # -1  = anomaly
    data["anomaly"] = predictions

    # Convert score so larger values indicate more anomalous records
    data["anomaly_score"] = -scores

    return data