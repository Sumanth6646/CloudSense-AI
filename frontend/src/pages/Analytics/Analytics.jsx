import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import Layout from "../../components/layout/Layout";
import { useBillingData } from "../../context/BillingDataContext";

function Analytics() {
  const { billingData, totalCost } = useBillingData();

  /*
   * --------------------------------------------------
   * Provider-wise cost
   * --------------------------------------------------
   */

  const providerData = useMemo(() => {
    const totals = {};

    billingData.forEach((item) => {
      const provider = item.Provider || "Unknown";
      const cost = Number(item.Cost || 0);

      totals[provider] = (totals[provider] || 0) + cost;
    });

    return Object.entries(totals)
      .map(([provider, cost]) => ({
        provider,
        cost: Number(cost.toFixed(2)),
      }))
      .sort((a, b) => b.cost - a.cost);
  }, [billingData]);

  /*
   * --------------------------------------------------
   * Service-wise cost
   * --------------------------------------------------
   */

  const serviceData = useMemo(() => {
    const totals = {};

    billingData.forEach((item) => {
      const service = item.Service || "Unknown";
      const cost = Number(item.Cost || 0);

      totals[service] = (totals[service] || 0) + cost;
    });

    return Object.entries(totals)
      .map(([service, cost]) => ({
        service,
        cost: Number(cost.toFixed(2)),
      }))
      .sort((a, b) => b.cost - a.cost);
  }, [billingData]);

  /*
   * --------------------------------------------------
   * Basic statistics
   * --------------------------------------------------
   */

  const statistics = useMemo(() => {
    if (billingData.length === 0) {
      return {
        averageCost: 0,
        highestCost: 0,
        lowestCost: 0,
        highestService: "N/A",
      };
    }

    const costs = billingData
      .map((item) => Number(item.Cost || 0))
      .filter((cost) => !Number.isNaN(cost));

    const highestRecord = billingData.reduce(
      (highest, current) => {
        const currentCost = Number(current.Cost || 0);
        const highestCost = Number(highest.Cost || 0);

        return currentCost > highestCost
          ? current
          : highest;
      },
      billingData[0]
    );

    return {
      averageCost:
        costs.length > 0
          ? costs.reduce((sum, cost) => sum + cost, 0) /
            costs.length
          : 0,

      highestCost:
        costs.length > 0
          ? Math.max(...costs)
          : 0,

      lowestCost:
        costs.length > 0
          ? Math.min(...costs)
          : 0,

      highestService:
        highestRecord?.Service || "Unknown",
    };
  }, [billingData]);

  /*
   * --------------------------------------------------
   * Empty state
   * --------------------------------------------------
   */

  if (billingData.length === 0) {
    return (
      <Layout>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Cost Analytics
          </h1>

          <p className="mt-2 text-slate-500">
            Analyze cloud spending across providers and
            services.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">

          <div className="text-5xl">
            📊
          </div>

          <h2 className="mt-5 text-xl font-bold text-slate-800">
            No billing data available
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Upload a billing CSV file to view your cost
            analytics.
          </p>

        </div>

      </Layout>
    );
  }

  return (
    <Layout>

      {/* --------------------------------------------------
          Page Header
      -------------------------------------------------- */}

      <div className="mb-8">

        <h1 className="text-3xl font-bold text-slate-900">
          Cost Analytics
        </h1>

        <p className="mt-2 text-slate-500">
          Analyze cloud spending across providers,
          services, and billing records.
        </p>

      </div>

      {/* --------------------------------------------------
          KPI Cards
      -------------------------------------------------- */}

      <div className="mb-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">

        {/* Total Cost */}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <p className="text-sm font-semibold text-slate-500">
            Total Cloud Cost
          </p>

          <p className="mt-2 text-3xl font-bold text-blue-600">
            ${totalCost.toLocaleString(undefined, {
              maximumFractionDigits: 2,
            })}
          </p>

        </div>

        {/* Billing Records */}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <p className="text-sm font-semibold text-slate-500">
            Billing Records
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {billingData.length}
          </p>

        </div>

        {/* Average Cost */}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <p className="text-sm font-semibold text-slate-500">
            Average Record Cost
          </p>

          <p className="mt-2 text-3xl font-bold text-emerald-600">
            $
            {statistics.averageCost.toLocaleString(
              undefined,
              {
                maximumFractionDigits: 2,
              }
            )}
          </p>

        </div>

        {/* Highest Service */}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <p className="text-sm font-semibold text-slate-500">
            Highest-Cost Service
          </p>

          <p className="mt-2 text-2xl font-bold text-amber-600">
            {statistics.highestService}
          </p>

        </div>

      </div>

      {/* --------------------------------------------------
          Provider Analysis
      -------------------------------------------------- */}

      <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="mb-6">

          <h2 className="text-xl font-bold text-slate-900">
            Cloud Provider Spending
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Compare total spending across cloud providers.
          </p>

        </div>

        <div className="h-[350px]">

          <ResponsiveContainer
            width="100%"
            height="100%"
          >

            <BarChart
              data={providerData}
              margin={{
                top: 10,
                right: 20,
                left: 10,
                bottom: 10,
              }}
            >

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                dataKey="provider"
                tick={{ fontSize: 12 }}
              />

              <YAxis
                tick={{ fontSize: 12 }}
              />

              <Tooltip
                formatter={(value) => [
                  `$${Number(value).toLocaleString()}`,
                  "Cost",
                ]}
              />

              <Bar
                dataKey="cost"
                fill="#2563EB"
                radius={[6, 6, 0, 0]}
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

      </div>

      {/* --------------------------------------------------
          Service Analysis
      -------------------------------------------------- */}

      <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="mb-6">

          <h2 className="text-xl font-bold text-slate-900">
            Service-wise Spending
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Identify which cloud services consume the
            most budget.
          </p>

        </div>

        <div className="h-[400px]">

          <ResponsiveContainer
            width="100%"
            height="100%"
          >

            <BarChart
              data={serviceData}
              layout="vertical"
              margin={{
                top: 10,
                right: 30,
                left: 30,
                bottom: 10,
              }}
            >

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                type="number"
                tick={{ fontSize: 12 }}
              />

              <YAxis
                type="category"
                dataKey="service"
                width={130}
                tick={{ fontSize: 11 }}
              />

              <Tooltip
                formatter={(value) => [
                  `$${Number(value).toLocaleString()}`,
                  "Cost",
                ]}
              />

              <Bar
                dataKey="cost"
                fill="#8B5CF6"
                radius={[0, 6, 6, 0]}
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

      </div>

      {/* --------------------------------------------------
          Cost Statistics
      -------------------------------------------------- */}

      <div className="mb-8 grid gap-5 md:grid-cols-3">

        {/* Highest */}

        <div className="rounded-2xl border border-red-100 bg-red-50 p-6">

          <p className="text-sm font-semibold text-red-600">
            Highest Individual Cost
          </p>

          <p className="mt-2 text-2xl font-bold text-red-700">
            $
            {statistics.highestCost.toLocaleString(
              undefined,
              {
                maximumFractionDigits: 2,
              }
            )}
          </p>

        </div>

        {/* Lowest */}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <p className="text-sm font-semibold text-slate-500">
            Lowest Individual Cost
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            $
            {statistics.lowestCost.toLocaleString(
              undefined,
              {
                maximumFractionDigits: 2,
              }
            )}
          </p>

        </div>

        {/* Services */}

        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6">

          <p className="text-sm font-semibold text-blue-600">
            Services Analyzed
          </p>

          <p className="mt-2 text-2xl font-bold text-blue-700">
            {serviceData.length}
          </p>

        </div>

      </div>

      {/* --------------------------------------------------
          Service Cost Table
      -------------------------------------------------- */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-200 p-6">

          <h2 className="text-xl font-bold text-slate-900">
            Service Cost Breakdown
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Detailed spending breakdown by cloud service.
          </p>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full text-left text-sm">

            <thead className="bg-slate-50">

              <tr>

                <th className="px-6 py-4 font-semibold text-slate-600">
                  Rank
                </th>

                <th className="px-6 py-4 font-semibold text-slate-600">
                  Service
                </th>

                <th className="px-6 py-4 font-semibold text-slate-600">
                  Cost
                </th>

                <th className="px-6 py-4 font-semibold text-slate-600">
                  Share of Total
                </th>

              </tr>

            </thead>

            <tbody>

              {serviceData.map(
                (item, index) => {

                  const percentage =
                    totalCost > 0
                      ? (item.cost / totalCost) * 100
                      : 0;

                  return (
                    <tr
                      key={item.service}
                      className="border-t border-slate-100 hover:bg-slate-50"
                    >

                      <td className="px-6 py-4 font-semibold text-slate-500">
                        #{index + 1}
                      </td>

                      <td className="px-6 py-4 font-semibold text-slate-900">
                        {item.service}
                      </td>

                      <td className="px-6 py-4 font-semibold text-blue-600">
                        $
                        {item.cost.toLocaleString(
                          undefined,
                          {
                            maximumFractionDigits: 2,
                          }
                        )}
                      </td>

                      <td className="px-6 py-4">

                        <div className="flex items-center gap-3">

                          <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-100">

                            <div
                              className="h-full rounded-full bg-blue-500"
                              style={{
                                width: `${Math.min(
                                  percentage,
                                  100
                                )}%`,
                              }}
                            />

                          </div>

                          <span className="text-xs font-semibold text-slate-500">
                            {percentage.toFixed(1)}%
                          </span>

                        </div>

                      </td>

                    </tr>
                  );
                }
              )}

            </tbody>

          </table>

        </div>

      </div>

    </Layout>
  );
}

export default Analytics;