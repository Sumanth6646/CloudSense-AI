import { useEffect, useState } from "react";
import { useBillingData } from "../../context/BillingDataContext";

function AnomaliesTable() {
  const { billingData } = useBillingData();

  const [anomalies, setAnomalies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /*
   * Run Isolation Forest whenever billing data changes.
   */
  useEffect(() => {
    if (!billingData || billingData.length < 5) {
      setAnomalies([]);
      setError("");
      return;
    }

    const detectAnomalies = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/anomaly/detect",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(billingData),
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.detail ||
              "Unable to detect billing anomalies."
          );
        }

        if (result.status !== "success") {
          throw new Error(
            result.message ||
              "Anomaly detection failed."
          );
        }

        setAnomalies(result.anomalies || []);

      } catch (err) {
        console.error(
          "Anomaly detection error:",
          err
        );

        setError(
          err.message ||
            "Unable to connect to anomaly detection API."
        );

        setAnomalies([]);

      } finally {
        setLoading(false);
      }
    };

    detectAnomalies();

  }, [billingData]);


  /*
   * Severity styling
   */
  const getSeverityClass = (severity) => {
    switch (severity) {
      case "Critical":
        return "bg-red-100 text-red-700";

      case "High":
        return "bg-orange-100 text-orange-700";

      case "Medium":
        return "bg-yellow-100 text-yellow-700";

      case "Low":
        return "bg-green-100 text-green-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  };


  return (
    <div className="mt-8 overflow-hidden rounded-2xl bg-white shadow-sm border border-slate-200">

      {/* Header */}
      <div className="border-b border-slate-200 p-6">

        <h2 className="text-xl font-bold text-slate-900">
          Recent Cost Anomalies
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Unusual spending detected using the
          Isolation Forest ML model.
        </p>

      </div>


      {/* No billing data */}
      {billingData.length === 0 && (
        <div className="p-10 text-center text-slate-400">

          <p>
            Upload billing data to detect
            cost anomalies.
          </p>

        </div>
      )}


      {/* Not enough data */}
      {billingData.length > 0 &&
        billingData.length < 5 && (
          <div className="p-10 text-center">

            <div className="text-4xl">
              📊
            </div>

            <p className="mt-3 font-semibold text-slate-700">
              Not enough data for ML detection
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Isolation Forest requires at least
              5 billing records.
            </p>

          </div>
        )}


      {/* Loading */}
      {loading && (
        <div className="p-10 text-center">

          <div className="text-4xl">
            🤖
          </div>

          <p className="mt-3 font-semibold text-blue-600">
            Running Isolation Forest...
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Analyzing billing patterns for unusual
            spending.
          </p>

        </div>
      )}


      {/* Error */}
      {error && !loading && (
        <div className="p-6">

          <div className="rounded-xl border border-red-200 bg-red-50 p-5">

            <h3 className="font-bold text-red-700">
              Anomaly detection failed
            </h3>

            <p className="mt-1 text-sm text-red-600">
              {error}
            </p>

          </div>

        </div>
      )}


      {/* No anomalies */}
      {!loading &&
        !error &&
        billingData.length >= 5 &&
        anomalies.length === 0 && (
          <div className="p-10 text-center">

            <div className="text-4xl">
              ✓
            </div>

            <p className="mt-3 font-semibold text-green-600">
              No unusual spending detected
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Isolation Forest did not identify
              any significant billing anomalies.
            </p>

          </div>
        )}


      {/* Anomaly table */}
      {!loading &&
        !error &&
        anomalies.length > 0 && (
          <div className="overflow-x-auto">

            <table className="w-full text-left text-sm">

              <thead className="bg-slate-50">

                <tr>

                  <th className="px-6 py-4 font-semibold text-slate-600">
                    Date
                  </th>

                  <th className="px-6 py-4 font-semibold text-slate-600">
                    Provider
                  </th>

                  <th className="px-6 py-4 font-semibold text-slate-600">
                    Service
                  </th>

                  <th className="px-6 py-4 font-semibold text-slate-600">
                    Cost
                  </th>

                  <th className="px-6 py-4 font-semibold text-slate-600">
                    Anomaly Score
                  </th>

                  <th className="px-6 py-4 font-semibold text-slate-600">
                    Severity
                  </th>

                  <th className="px-6 py-4 font-semibold text-slate-600">
                    Status
                  </th>

                </tr>

              </thead>


              <tbody>

                {anomalies.map((item, index) => (

                  <tr
                    key={`${item.Date}-${item.Service}-${index}`}
                    className="border-t border-slate-100 hover:bg-slate-50"
                  >

                    {/* Date */}
                    <td className="px-6 py-4">
                      {item.Date}
                    </td>


                    {/* Provider */}
                    <td className="px-6 py-4 font-medium">
                      {item.Provider}
                    </td>


                    {/* Service */}
                    <td className="px-6 py-4">
                      {item.Service}
                    </td>


                    {/* Cost */}
                    <td className="px-6 py-4 font-semibold">
                      $
                      {Number(
                        item.Cost || 0
                      ).toLocaleString(
                        undefined,
                        {
                          maximumFractionDigits: 2,
                        }
                      )}
                    </td>


                    {/* Anomaly Score */}
                    <td className="px-6 py-4">

                      <span className="font-mono text-xs text-slate-600">
                        {Number(
                          item.anomaly_score || 0
                        ).toFixed(4)}
                      </span>

                    </td>


                    {/* Severity */}
                    <td className="px-6 py-4">

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getSeverityClass(
                          item.severity
                        )}`}
                      >
                        {item.severity}
                      </span>

                    </td>


                    {/* Status */}
                    <td className="px-6 py-4">

                      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                        {item.status}
                      </span>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>
        )}

    </div>
  );
}

export default AnomaliesTable;