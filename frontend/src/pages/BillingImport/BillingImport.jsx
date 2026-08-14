import Layout from "../../components/layout/Layout";
import BillingUpload from "../../components/upload/BillingUpload";
import BillingInsights from "../../components/insights/BillingInsights";
import { useBillingData } from "../../context/BillingDataContext";

function BillingImport() {
  const {
    billingData,
    updateBillingData,
    totalCost,
  } = useBillingData();

  const handleDataImported = (data) => {
    updateBillingData(data);
  };

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

      {/* Imported Data Summary */}
      {billingData.length > 0 && (
        <>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {/* Records */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-slate-500">
                Imported Records
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                {billingData.length}
              </p>

              <p className="mt-1 text-sm text-slate-400">
                Billing entries processed
              </p>
            </div>

            {/* Total Cost */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-slate-500">
                Total Cost
              </p>

              <p className="mt-2 text-3xl font-bold text-blue-600">
                ${totalCost.toLocaleString()}
              </p>

              <p className="mt-1 text-sm text-slate-400">
                Total imported cloud spending
              </p>
            </div>

            {/* Status */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-slate-500">
                Data Status
              </p>

              <p className="mt-2 text-3xl font-bold text-green-600">
                Valid
              </p>

              <p className="mt-1 text-sm text-slate-400">
                CSV successfully processed
              </p>
            </div>
          </div>

          {/* Dynamic Analysis */}
          <BillingInsights
            billingData={billingData}
          />

          {/* Imported Billing Records */}
          <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 p-6">
              <h2 className="text-xl font-bold text-slate-900">
                Imported Billing Records
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Data successfully parsed from the uploaded CSV file.
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
                  {billingData.map((item, index) => (
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
                        ${Number(item.Cost || 0).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </Layout>
  );
}

export default BillingImport;