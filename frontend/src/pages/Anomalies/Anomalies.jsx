import {
  AlertTriangle,
  CheckCircle,
  Activity,
  ShieldAlert,
  Search,
} from "lucide-react";

import Layout from "../../components/layout/Layout";
import { useBillingData } from "../../context/BillingDataContext";

function Anomalies() {
  const {
    billingData,
    anomalies,
  } = useBillingData();

  /*
   * --------------------------------------------------
   * Helper Functions
   * --------------------------------------------------
   */

  const getSeverityClass = (severity) => {
    switch (severity) {
      case "Critical":
        return "bg-red-100 text-red-700 border-red-200";

      case "High":
        return "bg-orange-100 text-orange-700 border-orange-200";

      case "Medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";

      case "Low":
        return "bg-green-100 text-green-700 border-green-200";

      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case "Critical":
        return <ShieldAlert size={15} />;

      case "High":
        return <AlertTriangle size={15} />;

      default:
        return <Activity size={15} />;
    }
  };

  /*
   * --------------------------------------------------
   * Statistics
   * --------------------------------------------------
   */

  const totalRecords = billingData.length;

  const totalAnomalies = anomalies.length;

  const criticalCount = anomalies.filter(
    (item) => item.severity === "Critical"
  ).length;

  const highCount = anomalies.filter(
    (item) => item.severity === "High"
  ).length;

  const mediumCount = anomalies.filter(
    (item) => item.severity === "Medium"
  ).length;

  const lowCount = anomalies.filter(
    (item) => item.severity === "Low"
  ).length;

  const anomalyRate =
    totalRecords > 0
      ? ((totalAnomalies / totalRecords) * 100).toFixed(1)
      : "0.0";

  /*
   * --------------------------------------------------
   * Page
   * --------------------------------------------------
   */

  return (
    <Layout>

      {/* --------------------------------------------------
          Page Header
      -------------------------------------------------- */}

      <div className="mb-8">

        <div className="flex flex-wrap items-start justify-between gap-4">

          <div>

            <div className="flex items-center gap-3">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
                <AlertTriangle size={24} />
              </div>

              <div>

                <h1 className="text-3xl font-bold text-slate-900">
                  Anomaly Detection
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  Detect unusual cloud spending patterns using
                  Isolation Forest machine learning.
                </p>

              </div>

            </div>

          </div>

          {billingData.length > 0 && (
            <div className="rounded-xl border border-slate-200 bg-white px-5 py-3 shadow-sm">

              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Detection Model
              </p>

              <p className="mt-1 font-bold text-blue-600">
                Isolation Forest
              </p>

            </div>
          )}

        </div>

      </div>


      {/* --------------------------------------------------
          No Billing Data
      -------------------------------------------------- */}

      {billingData.length === 0 && (

        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">

            <Search size={30} />

          </div>

          <h2 className="mt-5 text-xl font-bold text-slate-900">
            No billing data available
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            Upload a cloud billing CSV file from the Billing Import
            page to allow CloudSense AI to analyze your spending
            and detect unusual records.
          </p>

        </div>

      )}


      {/* --------------------------------------------------
          Statistics
      -------------------------------------------------- */}

      {billingData.length > 0 && (

        <>
          <div className="mb-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">

            {/* Total Records */}

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm font-semibold text-slate-500">
                    Billing Records
                  </p>

                  <p className="mt-2 text-3xl font-bold text-slate-900">
                    {totalRecords}
                  </p>

                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Activity size={21} />
                </div>

              </div>

            </div>


            {/* Total Anomalies */}

            <div className="rounded-2xl border border-red-100 bg-white p-6 shadow-sm">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm font-semibold text-slate-500">
                    Detected Anomalies
                  </p>

                  <p className="mt-2 text-3xl font-bold text-red-600">
                    {totalAnomalies}
                  </p>

                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
                  <AlertTriangle size={21} />
                </div>

              </div>

              <p className="mt-3 text-xs text-slate-500">
                {anomalyRate}% of billing records
              </p>

            </div>


            {/* Critical */}

            <div className="rounded-2xl border border-red-100 bg-white p-6 shadow-sm">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm font-semibold text-slate-500">
                    Critical
                  </p>

                  <p className="mt-2 text-3xl font-bold text-red-600">
                    {criticalCount}
                  </p>

                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
                  <ShieldAlert size={21} />
                </div>

              </div>

            </div>


            {/* High */}

            <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm font-semibold text-slate-500">
                    High Priority
                  </p>

                  <p className="mt-2 text-3xl font-bold text-orange-600">
                    {highCount}
                  </p>

                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                  <AlertTriangle size={21} />
                </div>

              </div>

            </div>

          </div>


          {/* --------------------------------------------------
              Severity Summary
          -------------------------------------------------- */}

          <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="mb-5">

              <h2 className="text-xl font-bold text-slate-900">
                Anomaly Severity Summary
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Distribution of detected anomalies by severity.
              </p>

            </div>

            <div className="grid gap-4 md:grid-cols-4">

              {/* Critical */}

              <div className="rounded-xl border border-red-100 bg-red-50 p-5">

                <p className="text-sm font-semibold text-red-600">
                  Critical
                </p>

                <p className="mt-2 text-2xl font-bold text-red-700">
                  {criticalCount}
                </p>

              </div>


              {/* High */}

              <div className="rounded-xl border border-orange-100 bg-orange-50 p-5">

                <p className="text-sm font-semibold text-orange-600">
                  High
                </p>

                <p className="mt-2 text-2xl font-bold text-orange-700">
                  {highCount}
                </p>

              </div>


              {/* Medium */}

              <div className="rounded-xl border border-yellow-100 bg-yellow-50 p-5">

                <p className="text-sm font-semibold text-yellow-600">
                  Medium
                </p>

                <p className="mt-2 text-2xl font-bold text-yellow-700">
                  {mediumCount}
                </p>

              </div>


              {/* Low */}

              <div className="rounded-xl border border-green-100 bg-green-50 p-5">

                <p className="text-sm font-semibold text-green-600">
                  Low
                </p>

                <p className="mt-2 text-2xl font-bold text-green-700">
                  {lowCount}
                </p>

              </div>

            </div>

          </div>


          {/* --------------------------------------------------
              Anomaly Results
          -------------------------------------------------- */}

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            {/* Table Header */}

            <div className="border-b border-slate-200 p-6">

              <div className="flex flex-wrap items-center justify-between gap-4">

                <div>

                  <h2 className="text-xl font-bold text-slate-900">
                    Detected Cost Anomalies
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Records identified as unusual by the
                    Isolation Forest model.
                  </p>

                </div>

                <div className="rounded-xl bg-red-50 px-4 py-2">

                  <p className="text-xs font-semibold uppercase tracking-wide text-red-600">
                    Total Detected
                  </p>

                  <p className="text-lg font-bold text-red-700">
                    {totalAnomalies}
                  </p>

                </div>

              </div>

            </div>


            {/* No Anomalies */}

            {anomalies.length === 0 && (

              <div className="p-12 text-center">

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-green-600">

                  <CheckCircle size={28} />

                </div>

                <h3 className="mt-4 text-lg font-bold text-green-600">
                  No unusual spending detected
                </h3>

                <p className="mx-auto mt-2 max-w-lg text-sm text-slate-500">
                  The Isolation Forest model did not identify
                  any records that significantly differ from
                  the detected spending pattern.
                </p>

              </div>

            )}


            {/* --------------------------------------------------
                Table
            -------------------------------------------------- */}

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
                        className="border-t border-slate-100 transition hover:bg-slate-50"
                      >

                        {/* Date */}

                        <td className="whitespace-nowrap px-6 py-4">
                          {item.Date}
                        </td>


                        {/* Provider */}

                        <td className="whitespace-nowrap px-6 py-4 font-medium text-slate-900">
                          {item.Provider}
                        </td>


                        {/* Service */}

                        <td className="px-6 py-4 text-slate-700">
                          {item.Service}
                        </td>


                        {/* Region */}

                        <td className="whitespace-nowrap px-6 py-4 text-slate-600">
                          {item.Region}
                        </td>


                        {/* Cost */}

                        <td className="whitespace-nowrap px-6 py-4 font-bold text-slate-900">
                          $
                          {Number(
                            item.Cost || 0
                          ).toLocaleString()}
                        </td>


                        {/* Anomaly Score */}

                        <td className="whitespace-nowrap px-6 py-4 font-mono text-xs text-slate-600">
                          {Number(
                            item.anomaly_score || 0
                          ).toFixed(4)}
                        </td>


                        {/* Severity */}

                        <td className="px-6 py-4">

                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${getSeverityClass(
                              item.severity
                            )}`}
                          >

                            {getSeverityIcon(
                              item.severity
                            )}

                            {item.severity || "Unknown"}

                          </span>

                        </td>


                        {/* Status */}

                        <td className="px-6 py-4">

                          <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
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


          {/* --------------------------------------------------
              Model Information
          -------------------------------------------------- */}

          <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-6">

            <div className="flex gap-4">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <Activity size={20} />
              </div>

              <div>

                <h3 className="font-bold text-blue-900">
                  How CloudSense AI detects anomalies
                </h3>

                <p className="mt-2 text-sm leading-6 text-blue-800">
                  CloudSense AI uses the Isolation Forest
                  machine learning algorithm to identify billing
                  records that behave differently from the
                  normal spending pattern. The model analyzes
                  billing cost characteristics and assigns an
                  anomaly score to each record.
                </p>

                <p className="mt-2 text-sm leading-6 text-blue-800">
                  Records classified as anomalies are displayed
                  above so that unusual cloud spending can be
                  investigated.
                </p>

              </div>

            </div>

          </div>

        </>

      )}

    </Layout>
  );
}

export default Anomalies;