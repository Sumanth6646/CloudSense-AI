import { useBillingData } from "../../context/BillingDataContext";

function AnomaliesTable() {
  const { billingData } = useBillingData();

  /*
   * Anomaly Detection
   *
   * The backend now uses Isolation Forest.
   *
   * anomaly =  1  -> Normal
   * anomaly = -1  -> Anomaly
   */

  const anomalies = billingData
    .filter((item) => Number(item.anomaly) === -1)
    .map((item) => {
      const anomalyScore = Number(item.anomaly_score || 0);

      /*
       * Determine severity using the ML anomaly score.
       *
       * Higher anomaly score = more unusual.
       */
      let severity = "Medium";

      if (anomalyScore >= 0.15) {
        severity = "Critical";
      } else if (anomalyScore >= 0.10) {
        severity = "High";
      } else {
        severity = "Medium";
      }

      return {
        ...item,
        severity,
        status: "Open",
      };
    })
    .sort(
      (a, b) =>
        Number(b.anomaly_score || 0) -
        Number(a.anomaly_score || 0)
    );

  const getSeverityClass = (severity) => {
    switch (severity) {
      case "Critical":
        return "bg-red-100 text-red-700";

      case "High":
        return "bg-orange-100 text-orange-700";

      case "Medium":
        return "bg-yellow-100 text-yellow-700";

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
          Unusual spending detected using Isolation Forest.
        </p>

      </div>

      {/* No data */}
      {billingData.length === 0 && (
        <div className="p-10 text-center text-slate-400">
          Upload billing data to detect cost anomalies.
        </div>
      )}

      {/* No anomalies */}
      {billingData.length > 0 && anomalies.length === 0 && (
        <div className="p-10 text-center">

          <div className="text-4xl">
            ✓
          </div>

          <p className="mt-3 font-semibold text-green-600">
            No unusual spending detected
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Isolation Forest did not identify any anomalous
            billing records.
          </p>

        </div>
      )}

      {/* Anomaly table */}
      {anomalies.length > 0 && (
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

                  <td className="px-6 py-4">
                    {item.Date}
                  </td>

                  <td className="px-6 py-4 font-medium">
                    {item.Provider}
                  </td>

                  <td className="px-6 py-4">
                    {item.Service}
                  </td>

                  <td className="px-6 py-4 font-semibold">
                    ${Number(item.Cost || 0).toLocaleString()}
                  </td>

                  <td className="px-6 py-4">
                    {Number(item.anomaly_score || 0).toFixed(3)}
                  </td>

                  <td className="px-6 py-4">

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${getSeverityClass(
                        item.severity
                      )}`}
                    >
                      {item.severity}
                    </span>

                  </td>

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