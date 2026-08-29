import Layout from "../../components/layout/Layout";
import { useBillingData } from "../../context/BillingDataContext";
import {
  BarChart3,
  DollarSign,
  Database,
  TrendingUp,
  Award,
} from "lucide-react";

function Analytics() {
  const { billingData, totalCost } = useBillingData();

  /*
   * --------------------------------------------------
   * Basic calculations
   * --------------------------------------------------
   */

  const recordCount = billingData.length;

  const averageCost =
    recordCount > 0
      ? totalCost / recordCount
      : 0;

  const highestCostRecord =
    billingData.length > 0
      ? billingData.reduce((highest, item) =>
          Number(item.Cost || 0) >
          Number(highest.Cost || 0)
            ? item
            : highest
        )
      : null;

  /*
   * --------------------------------------------------
   * Provider cost analysis
   * --------------------------------------------------
   */

  const providerTotals = {};

  billingData.forEach((item) => {
    const provider = item.Provider || "Unknown";
    const cost = Number(item.Cost || 0);

    providerTotals[provider] =
      (providerTotals[provider] || 0) + cost;
  });

  const providerEntries = Object.entries(
    providerTotals
  ).sort((a, b) => b[1] - a[1]);

  /*
   * --------------------------------------------------
   * Service cost analysis
   * --------------------------------------------------
   */

  const serviceTotals = {};

  billingData.forEach((item) => {
    const service = item.Service || "Unknown";
    const cost = Number(item.Cost || 0);

    serviceTotals[service] =
      (serviceTotals[service] || 0) + cost;
  });

  const serviceEntries = Object.entries(
    serviceTotals
  ).sort((a, b) => b[1] - a[1]);

  /*
   * --------------------------------------------------
   * Daily spending analysis
   * --------------------------------------------------
   */

  const dailyTotals = {};

  billingData.forEach((item) => {
    const date = item.Date || "Unknown";
    const cost = Number(item.Cost || 0);

    dailyTotals[date] =
      (dailyTotals[date] || 0) + cost;
  });

  const dailyEntries = Object.entries(
    dailyTotals
  );

  /*
   * --------------------------------------------------
   * Highest spending provider
   * --------------------------------------------------
   */

  const highestProvider =
    providerEntries.length > 0
      ? providerEntries[0]
      : null;

  /*
   * --------------------------------------------------
   * Highest spending service
   * --------------------------------------------------
   */

  const highestService =
    serviceEntries.length > 0
      ? serviceEntries[0]
      : null;

  return (
    <Layout>

      {/* --------------------------------------------------
          Header
      -------------------------------------------------- */}

      <div className="mb-8">

        <div className="flex items-center gap-3">

          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <BarChart3 size={24} />
          </div>

          <div>

            <h1 className="text-3xl font-bold text-slate-900">
              Cost Analytics
            </h1>

            <p className="mt-1 text-slate-500">
              Detailed analysis of your cloud spending.
            </p>

          </div>

        </div>

      </div>

      {/* --------------------------------------------------
          Empty State
      -------------------------------------------------- */}

      {billingData.length === 0 ? (

        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">

          <BarChart3
            size={48}
            className="mx-auto text-slate-300"
          />

          <h2 className="mt-4 text-xl font-bold text-slate-800">
            No billing data available
          </h2>

          <p className="mt-2 text-slate-500">
            Upload a billing CSV file to view
            detailed cost analytics.
          </p>

        </div>

      ) : (

        <>

          {/* --------------------------------------------------
              KPI Cards
          -------------------------------------------------- */}

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

            {/* Total Cost */}

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm font-semibold text-slate-500">
                    Total Cloud Cost
                  </p>

                  <p className="mt-2 text-3xl font-bold text-slate-900">
                    ${totalCost.toLocaleString(
                      undefined,
                      {
                        maximumFractionDigits: 2,
                      }
                    )}
                  </p>

                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <DollarSign size={22} />
                </div>

              </div>

            </div>

            {/* Records */}

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm font-semibold text-slate-500">
                    Billing Records
                  </p>

                  <p className="mt-2 text-3xl font-bold text-slate-900">
                    {recordCount}
                  </p>

                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                  <Database size={22} />
                </div>

              </div>

            </div>

            {/* Average Cost */}

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm font-semibold text-slate-500">
                    Average Cost
                  </p>

                  <p className="mt-2 text-3xl font-bold text-slate-900">
                    ${averageCost.toLocaleString(
                      undefined,
                      {
                        maximumFractionDigits: 2,
                      }
                    )}
                  </p>

                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600">
                  <TrendingUp size={22} />
                </div>

              </div>

            </div>

            {/* Highest Cost */}

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm font-semibold text-slate-500">
                    Highest Record
                  </p>

                  <p className="mt-2 text-3xl font-bold text-slate-900">
                    $
                    {Number(
                      highestCostRecord?.Cost || 0
                    ).toLocaleString()}
                  </p>

                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                  <Award size={22} />
                </div>

              </div>

            </div>

          </div>

          {/* --------------------------------------------------
              Provider Analysis
          -------------------------------------------------- */}

          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="mb-6">

              <h2 className="text-xl font-bold text-slate-900">
                Cost by Cloud Provider
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Total spending across each cloud provider.
              </p>

            </div>

            <div className="space-y-5">

              {providerEntries.map(
                ([provider, cost]) => {

                  const percentage =
                    totalCost > 0
                      ? (cost / totalCost) * 100
                      : 0;

                  return (
                    <div key={provider}>

                      <div className="mb-2 flex items-center justify-between">

                        <span className="font-semibold text-slate-700">
                          {provider}
                        </span>

                        <span className="font-bold text-slate-900">
                          $
                          {cost.toLocaleString(
                            undefined,
                            {
                              maximumFractionDigits: 2,
                            }
                          )}
                        </span>

                      </div>

                      <div className="h-3 overflow-hidden rounded-full bg-slate-100">

                        <div
                          className="h-full rounded-full bg-blue-500"
                          style={{
                            width: `${percentage}%`,
                          }}
                        />

                      </div>

                      <p className="mt-1 text-xs text-slate-400">
                        {percentage.toFixed(1)}%
                        of total spending
                      </p>

                    </div>
                  );
                }
              )}

            </div>

          </div>

          {/* --------------------------------------------------
              Service Analysis
          -------------------------------------------------- */}

          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="mb-6">

              <h2 className="text-xl font-bold text-slate-900">
                Cost by Service
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Services ranked by total cloud spending.
              </p>

            </div>

            <div className="grid gap-4 md:grid-cols-2">

              {serviceEntries.map(
                ([service, cost], index) => {

                  const percentage =
                    totalCost > 0
                      ? (cost / totalCost) * 100
                      : 0;

                  return (
                    <div
                      key={service}
                      className="rounded-xl border border-slate-100 bg-slate-50 p-5"
                    >

                      <div className="flex items-start justify-between gap-3">

                        <div>

                          <p className="text-sm font-semibold text-slate-500">
                            #{index + 1}
                          </p>

                          <h3 className="mt-1 font-bold text-slate-900">
                            {service}
                          </h3>

                        </div>

                        <p className="font-bold text-blue-600">
                          $
                          {cost.toLocaleString(
                            undefined,
                            {
                              maximumFractionDigits: 2,
                            }
                          )}
                        </p>

                      </div>

                      <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">

                        <div
                          className="h-full rounded-full bg-blue-400"
                          style={{
                            width: `${percentage}%`,
                          }}
                        />

                      </div>

                      <p className="mt-2 text-xs text-slate-500">
                        {percentage.toFixed(1)}%
                        of total spending
                      </p>

                    </div>
                  );
                }
              )}

            </div>

          </div>

          {/* --------------------------------------------------
              Daily Spending
          -------------------------------------------------- */}

          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="mb-6">

              <h2 className="text-xl font-bold text-slate-900">
                Daily Spending
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Daily cloud spending from imported billing data.
              </p>

            </div>

            <div className="space-y-3">

              {dailyEntries.map(
                ([date, cost]) => {

                  const percentage =
                    totalCost > 0
                      ? (cost / totalCost) * 100
                      : 0;

                  return (
                    <div
                      key={date}
                      className="flex items-center gap-4"
                    >

                      <div className="w-24 shrink-0 text-sm font-medium text-slate-600">
                        {date}
                      </div>

                      <div className="flex-1">

                        <div className="h-8 overflow-hidden rounded-lg bg-slate-100">

                          <div
                            className="flex h-full items-center rounded-lg bg-blue-500 px-3 text-xs font-semibold text-white"
                            style={{
                              width: `${Math.max(
                                percentage,
                                2
                              )}%`,
                            }}
                          >
                            {percentage >= 5
                              ? `${percentage.toFixed(
                                  1
                                )}%`
                              : ""}
                          </div>

                        </div>

                      </div>

                      <div className="w-24 text-right text-sm font-bold text-slate-800">
                        $
                        {cost.toLocaleString(
                          undefined,
                          {
                            maximumFractionDigits: 2,
                          }
                        )}
                      </div>

                    </div>
                  );
                }
              )}

            </div>

          </div>

          {/* --------------------------------------------------
              Analytics Insights
          -------------------------------------------------- */}

          <div className="mt-8 grid gap-5 md:grid-cols-2">

            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6">

              <p className="text-sm font-semibold text-blue-600">
                Top Provider
              </p>

              <h3 className="mt-2 text-2xl font-bold text-blue-900">
                {highestProvider
                  ? highestProvider[0]
                  : "N/A"}
              </h3>

              <p className="mt-2 text-sm text-blue-700">
                {highestProvider
                  ? `$${highestProvider[1].toLocaleString(
                      undefined,
                      {
                        maximumFractionDigits: 2,
                      }
                    )} in total spending`
                  : "No provider data available."}
              </p>

            </div>

            <div className="rounded-2xl border border-amber-100 bg-amber-50 p-6">

              <p className="text-sm font-semibold text-amber-600">
                Top Service
              </p>

              <h3 className="mt-2 text-2xl font-bold text-amber-900">
                {highestService
                  ? highestService[0]
                  : "N/A"}
              </h3>

              <p className="mt-2 text-sm text-amber-700">
                {highestService
                  ? `$${highestService[1].toLocaleString(
                      undefined,
                      {
                        maximumFractionDigits: 2,
                      }
                    )} in total spending`
                  : "No service data available."}
              </p>

            </div>

          </div>

        </>

      )}

    </Layout>
  );
}

export default Analytics;