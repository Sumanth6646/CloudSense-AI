import { useBillingData } from "../../context/BillingDataContext";

function AnomaliesTable() {
  const { billingData } = useBillingData();

  /*
   * Temporary frontend anomaly detection.
   *
   * Later this will be replaced by the
   * Isolation Forest ML model in Phase 4.
   */

  const costs = billingData.map((item) =>
    Number(item.Cost || 0)
  );

  const averageCost =
    costs.length > 0
      ? costs.reduce((sum, cost) => sum + cost, 0) /
        costs.length
      : 0;

  /*
   * A record is considered anomalous if its cost
   * is at least 1.5x the average cost.
   */

  const anomalyThreshold = averageCost * 1.5;

  const anomalies = billingData
    .filter(
      (item) =>
        Number(item.Cost || 0) >= anomalyThreshold
    )
    .map((item) => {
      const cost = Number(item.Cost || 0);

      let severity = "Low";

      if (cost >= averageCost * 2.5) {
        severity = "Critical";
      } else if (cost >= averageCost * 2) {
        severity = "High";
      } else if (cost >= averageCost * 1.5) {
        severity = "Medium";
      }

      return {
        ...item,
        severity,
        status: "Open",
      };
    });

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
          Unusual spending detected from imported billing data.
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
            The imported billing data is currently within
            the expected spending range.
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
                  key={index}
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
                    ${Number(item.Cost).toLocaleString()}
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