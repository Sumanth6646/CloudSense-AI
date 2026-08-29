import { useBillingData } from "../../context/BillingDataContext";
import Layout from "../../components/layout/Layout";
import BillingUpload from "../../components/upload/BillingUpload";

function BillingImport() {
  const {
    billingData,
    updateBillingData,
    totalCost,
  } = useBillingData();

  /*
   * Backend returns:
   *
   * {
   *   status,
   *   filename,
   *   records,
   *   total_cost,
   *   provider_summary,
   *   service_summary,
   *   data: [...]
   * }
   *
   * So billingData stores the complete backend response.
   */

  const handleDataImported = (result) => {
    updateBillingData(result);
  };

  const records = billingData?.data || [];

  const providerSummary =
    billingData?.provider_summary || {};

  const serviceSummary =
    billingData?.service_summary || {};

  const anomalyCount = records.filter(
    (item) => item.prediction === -1
  ).length;

  return (
    <Layout>

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Billing Import
        </h1>

        <p className="mt-2 text-slate-500">
          Upload and analyze your cloud billing data.
        </p>
      </div>

      {/* Upload Section */}
      <BillingUpload
        onDataImported={handleDataImported}
      />

      {/* Results */}
      {records.length > 0 && (
        <div className="mt-8">

          {/* Summary Cards */}
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

            {/* Imported Records */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-slate-500">
                Imported Records
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                {billingData?.records || records.length}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Billing records processed
              </p>
            </div>

            {/* Total Cost */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-slate-500">
                Total Cloud Cost
              </p>

              <p className="mt-2 text-3xl font-bold text-blue-600">
                ${Number(
                  billingData?.total_cost ?? totalCost
                ).toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Total imported spending
              </p>
            </div>

            {/* Anomalies */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-slate-500">
                Detected Anomalies
              </p>

              <p className="mt-2 text-3xl font-bold text-red-600">
                {anomalyCount}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Detected by Isolation Forest
              </p>
            </div>

            {/* Data Status */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-slate-500">
                Data Status
              </p>

              <p className="mt-2 text-3xl font-bold text-green-600">
                Valid
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Successfully processed
              </p>
            </div>

          </div>


          {/* Provider Summary */}
          {Object.keys(providerSummary).length > 0 && (
            <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="mb-5">
                <h2 className="text-xl font-bold text-slate-900">
                  Cloud Provider Cost Analysis
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Total spending grouped by cloud provider.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-3">

                {Object.entries(providerSummary).map(
                  ([provider, cost]) => (

                    <div
                      key={provider}
                      className="rounded-xl bg-slate-50 p-5"
                    >

                      <p className="text-sm font-medium text-slate-500">
                        {provider}
                      </p>

                      <p className="mt-2 text-2xl font-bold text-slate-900">
                        ${Number(cost).toLocaleString(
                          undefined,
                          {
                            maximumFractionDigits: 2,
                          }
                        )}
                      </p>

                    </div>

                  )
                )}

              </div>

            </div>
          )}


          {/* Service Summary */}
          {Object.keys(serviceSummary).length > 0 && (
            <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="mb-5">
                <h2 className="text-xl font-bold text-slate-900">
                  Service Cost Analysis
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Total spending grouped by cloud service.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

                {Object.entries(serviceSummary).map(
                  ([service, cost]) => (

                    <div
                      key={service}
                      className="rounded-xl border border-slate-200 p-5 hover:bg-slate-50"
                    >

                      <p className="text-sm font-medium text-slate-500">
                        {service}
                      </p>

                      <p className="mt-2 text-xl font-bold text-slate-900">
                        ${Number(cost).toLocaleString(
                          undefined,
                          {
                            maximumFractionDigits: 2,
                          }
                        )}
                      </p>

                    </div>

                  )
                )}

              </div>

            </div>
          )}


          {/* Billing Records */}
          <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            {/* Table Header */}
            <div className="border-b border-slate-200 p-6">

              <h2 className="text-xl font-bold text-slate-900">
                Imported Billing Records
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Billing data processed by the CloudSense AI
                backend and analyzed using machine learning.
              </p>

            </div>


            {/* Table */}
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
                      Usage
                    </th>

                    <th className="px-6 py-4 font-semibold text-slate-600">
                      Cost
                    </th>

                    <th className="px-6 py-4 font-semibold text-slate-600">
                      Detection
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {records.map((item, index) => {

                    const isAnomaly =
                      item.prediction === -1;

                    return (
                      <tr
                        key={index}
                        className={`border-t border-slate-100 ${
                          isAnomaly
                            ? "bg-red-50/40"
                            : "hover:bg-slate-50"
                        }`}
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


                        {/* Region */}
                        <td className="px-6 py-4">
                          {item.Region}
                        </td>


                        {/* Usage */}
                        <td className="px-6 py-4">
                          {item.Usage} {item.Unit}
                        </td>


                        {/* Cost */}
                        <td className="px-6 py-4 font-semibold">
                          ${Number(
                            item.Cost || 0
                          ).toLocaleString(
                            undefined,
                            {
                              maximumFractionDigits: 2,
                            }
                          )}
                        </td>


                        {/* Detection */}
                        <td className="px-6 py-4">

                          {isAnomaly ? (

                            <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                              Anomaly
                            </span>

                          ) : (

                            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                              Normal
                            </span>

                          )}

                        </td>

                      </tr>
                    );
                  })}

                </tbody>

              </table>

            </div>

          </div>

        </div>
      )}

    </Layout>
  );
}

export default BillingImport;