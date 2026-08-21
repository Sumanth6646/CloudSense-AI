import { useBillingData } from "../../context/BillingDataContext";
import Layout from "../../components/layout/Layout";
import BillingUpload from "../../components/upload/BillingUpload";

function BillingImport() {
  const {
    billingData,
    updateBillingData,
    totalCost,
  } = useBillingData();

  const handleDataImported = (result) => {
    updateBillingData(result);
  };

  const records = billingData?.data || [];

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

      {/* Upload */}
      <BillingUpload
        onDataImported={handleDataImported}
      />

      {/* Results */}
      {records.length > 0 && (
        <div className="mt-8">

          {/* Summary Cards */}
          <div className="grid gap-5 md:grid-cols-3">

            <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
              <p className="text-sm font-semibold text-slate-500">
                Imported Records
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                {billingData.records}
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
              <p className="text-sm font-semibold text-slate-500">
                Total Cost
              </p>

              <p className="mt-2 text-3xl font-bold text-blue-600">
                ${Number(totalCost).toLocaleString()}
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
              <p className="text-sm font-semibold text-slate-500">
                Data Status
              </p>

              <p className="mt-2 text-3xl font-bold text-green-600">
                Valid
              </p>
            </div>

          </div>

          {/* Provider Summary */}
          <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm border border-slate-200">

            <h2 className="text-xl font-bold text-slate-900">
              Cloud Provider Cost Analysis
            </h2>

            <div className="mt-5 grid gap-4 md:grid-cols-3">

              {Object.entries(
                billingData.provider_summary || {}
              ).map(([provider, cost]) => (

                <div
                  key={provider}
                  className="rounded-xl bg-slate-50 p-5"
                >
                  <p className="text-sm text-slate-500">
                    {provider}
                  </p>

                  <p className="mt-2 text-2xl font-bold text-slate-900">
                    ${Number(cost).toLocaleString()}
                  </p>
                </div>

              ))}

            </div>

          </div>

          {/* Billing Records */}
          <div className="mt-8 overflow-hidden rounded-2xl bg-white shadow-sm border border-slate-200">

            <div className="border-b border-slate-200 p-6">

              <h2 className="text-xl font-bold text-slate-900">
                Imported Billing Records
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Billing data processed by the CloudSense AI backend.
              </p>

            </div>

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
                  </tr>

                </thead>

                <tbody>

                  {records.map((item, index) => (

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

                      <td className="px-6 py-4">
                        {item.Region}
                      </td>

                      <td className="px-6 py-4">
                        {item.Usage} {item.Unit}
                      </td>

                      <td className="px-6 py-4 font-semibold">
                        ${Number(item.Cost).toLocaleString()}
                      </td>

                    </tr>

                  ))}

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