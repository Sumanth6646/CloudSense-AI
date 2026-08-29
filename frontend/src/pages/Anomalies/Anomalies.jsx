import {
  AlertTriangle,
  ShieldCheck,
  Activity,
  TrendingUp,
} from "lucide-react";

import Layout from "../../components/layout/Layout";
import AnomaliesTable from "../../components/tables/AnomaliesTable";
import { useBillingData } from "../../context/BillingDataContext";

function Anomalies() {
  const {
    billingData,
    anomalies,
  } = useBillingData();

  /*
   * --------------------------------------------------
   * Calculate anomaly statistics
   * --------------------------------------------------
   */

  const totalRecords = billingData.length;

  const anomalyCount = anomalies.length;

  const normalRecords = Math.max(
    totalRecords - anomalyCount,
    0
  );

  const anomalyPercentage =
    totalRecords > 0
      ? (anomalyCount / totalRecords) * 100
      : 0;

  /*
   * Count severity levels
   */

  const criticalCount = anomalies.filter(
    (item) => item.severity === "Critical"
  ).length;

  const highCount = anomalies.filter(
    (item) => item.severity === "High"
  ).length;

  const mediumCount = anomalies.filter(
    (item) => item.severity === "Medium"
  ).length;

  /*
   * Total anomalous spending
   */

  const anomalousCost = anomalies.reduce(
    (total, item) =>
      total + Number(item.Cost || 0),
    0
  );

  return (
    <Layout>

      {/* --------------------------------------------------
          Page Header
      -------------------------------------------------- */}

      <div className="mb-8">

        <div className="flex items-center gap-3">

          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
            <AlertTriangle size={24} />
          </div>

          <div>

            <h1 className="text-3xl font-bold text-slate-900">
              Anomaly Detection
            </h1>

            <p className="mt-1 text-slate-500">
              Identify unusual cloud spending patterns using
              Isolation Forest machine learning.
            </p>

          </div>

        </div>

      </div>

      {/* --------------------------------------------------
          No Billing Data
      -------------------------------------------------- */}

      {billingData.length === 0 ? (

        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
            <Activity size={28} />
          </div>

          <h2 className="mt-4 text-xl font-bold text-slate-800">
            No billing data available
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
            Upload a billing CSV file from the Billing Import
            page to analyze your cloud spending and detect
            anomalies.
          </p>

        </div>

      ) : (

        <>

          {/* --------------------------------------------------
              Summary Cards
          -------------------------------------------------- */}

          <div className="mb-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">

            {/* Total Records */}

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm font-semibold text-slate-500">
                    Total Records
                  </p>

                  <p className="mt-2 text-3xl font-bold text-slate-900">
                    {totalRecords}
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Activity size={22} />
                </div>

              </div>

            </div>

            {/* Anomalies */}

            <div className="rounded-2xl border border-red-100 bg-white p-6 shadow-sm">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm font-semibold text-slate-500">
                    Detected Anomalies
                  </p>

                  <p className="mt-2 text-3xl font-bold text-red-600">
                    {anomalyCount}
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
                  <AlertTriangle size={22} />
                </div>

              </div>

              <p className="mt-2 text-xs text-slate-500">
                {anomalyPercentage.toFixed(1)}% of billing records
              </p>

            </div>

            {/* Normal Records */}

            <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm font-semibold text-slate-500">
                    Normal Records
                  </p>

                  <p className="mt-2 text-3xl font-bold text-emerald-600">
                    {normalRecords}
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <ShieldCheck size={22} />
                </div>

              </div>

              <p className="mt-2 text-xs text-slate-500">
                Records classified as normal
              </p>

            </div>

            {/* Anomalous Cost */}

            <div className="rounded-2xl border border-amber-100 bg-white p-6 shadow-sm">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm font-semibold text-slate-500">
                    Anomalous Cost
                  </p>

                  <p className="mt-2 text-3xl font-bold text-amber-600">
                    ${anomalousCost.toLocaleString(
                      undefined,
                      {
                        maximumFractionDigits: 0,
                      }
                    )}
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                  <TrendingUp size={22} />
                </div>

              </div>

              <p className="mt-2 text-xs text-slate-500">
                Combined cost of detected anomalies
              </p>

            </div>

          </div>

          {/* --------------------------------------------------
              Severity Summary
          -------------------------------------------------- */}

          <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="mb-5">

              <h2 className="text-xl font-bold text-slate-900">
                Anomaly Severity
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Classification of detected unusual spending
                records.
              </p>

            </div>

            <div className="grid gap-4 md:grid-cols-3">

              {/* Critical */}

              <div className="rounded-xl bg-red-50 p-5">

                <p className="text-sm font-semibold text-red-600">
                  Critical
                </p>

                <p className="mt-2 text-3xl font-bold text-red-700">
                  {criticalCount}
                </p>

                <p className="mt-1 text-xs text-red-500">
                  Highest priority anomalies
                </p>

              </div>

              {/* High */}

              <div className="rounded-xl bg-orange-50 p-5">

                <p className="text-sm font-semibold text-orange-600">
                  High
                </p>

                <p className="mt-2 text-3xl font-bold text-orange-700">
                  {highCount}
                </p>

                <p className="mt-1 text-xs text-orange-500">
                  Significant spending deviations
                </p>

              </div>

              {/* Medium */}

              <div className="rounded-xl bg-yellow-50 p-5">

                <p className="text-sm font-semibold text-yellow-600">
                  Medium
                </p>

                <p className="mt-2 text-3xl font-bold text-yellow-700">
                  {mediumCount}
                </p>

                <p className="mt-1 text-xs text-yellow-600">
                  Potential spending irregularities
                </p>

              </div>

            </div>

          </div>

          {/* --------------------------------------------------
              ML Information
          -------------------------------------------------- */}

          <div className="mb-8 rounded-2xl border border-blue-200 bg-blue-50 p-6">

            <div className="flex gap-4">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <Activity size={20} />
              </div>

              <div>

                <h2 className="font-bold text-blue-900">
                  Isolation Forest Analysis
                </h2>

                <p className="mt-1 text-sm leading-6 text-blue-700">
                  CloudSense AI uses the Isolation Forest
                  machine learning algorithm to identify
                  billing records that differ significantly
                  from normal spending patterns.
                </p>

                <p className="mt-2 text-xs text-blue-600">
                  Lower anomaly scores generally indicate
                  records that are more unusual compared with
                  the rest of the billing dataset.
                </p>

              </div>

            </div>

          </div>

          {/* --------------------------------------------------
              Detailed Anomaly Table
          -------------------------------------------------- */}

          <AnomaliesTable />

        </>

      )}

    </Layout>
  );
}

export default Anomalies;