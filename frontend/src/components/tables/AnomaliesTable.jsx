import { useBillingData } from "../../context/BillingDataContext";

function AnomaliesTable() {
  const {
    billingData,
    anomalies,
  } = useBillingData();

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

        <div className="flex flex-wrap items-center justify-between gap-3">

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Recent Cost Anomalies
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Unusual spending detected using Isolation Forest ML.
            </p>
          </div>

          {billingData.length > 0 && (
            <div className="rounded-xl bg-red-50 px-4 py-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-red-600">
                Detected
              </p>

              <p className="text-lg font-bold text-red-700">
                {anomalies.length}
              </p>
            </div>
          )}

        </div>

      </div>

      {/* No billing data */}
      {billingData.length === 0 && (
        <div className="p-10 text-center text-slate-400">

          <div className="text-4xl">
            📊
          </div>

          <p className="mt-3 font-semibold">
            No billing data available
          </p>

          <p className="mt-1 text-sm">
            Upload a billing CSV file to detect anomalies.
          </p>

        </div>
      )}

      {/* No anomalies */}
      {billingData.length > 0 &&
        anomalies.length === 0 && (
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
                  Region
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

                  <td className="px-6 py-4">
                    {item.Region}
                  </td>

                  <td className="px-6 py-4 font-semibold">
                    $
                    {Number(
                      item.Cost || 0
                    ).toLocaleString()}
                  </td>

                  <td className="px-6 py-4">
                    {Number(
                      item.anomaly_score || 0
                    ).toFixed(4)}
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
                      {item.status || "Open"}
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