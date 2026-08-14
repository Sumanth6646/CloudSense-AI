import { useMemo } from "react";

function BillingInsights({ billingData }) {
  const analysis = useMemo(() => {
    if (!billingData || billingData.length === 0) {
      return {
        totalCost: 0,
        averageCost: 0,
        highestService: "N/A",
        highestServiceCost: 0,
        highestCostDay: "N/A",
        highestDayCost: 0,
        providerCosts: {},
        serviceCosts: {},
      };
    }

    const totalCost = billingData.reduce(
      (total, item) => total + Number(item.Cost || 0),
      0
    );

    const serviceCosts = {};
    const providerCosts = {};
    const dailyCosts = {};

    billingData.forEach((item) => {
      const cost = Number(item.Cost || 0);

      const service = item.Service || "Unknown";
      const provider = item.Provider || "Unknown";
      const date = item.Date || "Unknown";

      serviceCosts[service] =
        (serviceCosts[service] || 0) + cost;

      providerCosts[provider] =
        (providerCosts[provider] || 0) + cost;

      dailyCosts[date] =
        (dailyCosts[date] || 0) + cost;
    });

    const highestService = Object.entries(serviceCosts).sort(
      (a, b) => b[1] - a[1]
    )[0];

    const highestCostDay = Object.entries(dailyCosts).sort(
      (a, b) => b[1] - a[1]
    )[0];

    return {
      totalCost,
      averageCost: totalCost / billingData.length,

      highestService: highestService
        ? highestService[0]
        : "N/A",

      highestServiceCost: highestService
        ? highestService[1]
        : 0,

      highestCostDay: highestCostDay
        ? highestCostDay[0]
        : "N/A",

      highestDayCost: highestCostDay
        ? highestCostDay[1]
        : 0,

      providerCosts,
      serviceCosts,
    };
  }, [billingData]);

  if (!billingData || billingData.length === 0) {
    return null;
  }

  const providerEntries = Object.entries(
    analysis.providerCosts
  ).sort((a, b) => b[1] - a[1]);

  const serviceEntries = Object.entries(
    analysis.serviceCosts
  ).sort((a, b) => b[1] - a[1]);

  const highestProvider = providerEntries[0];

  return (
    <div className="mt-8">
      {/* Section Header */}
      <div className="mb-5">
        <h2 className="text-2xl font-bold text-slate-900">
          Billing Analysis
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Automatic analysis generated from your imported cloud billing data.
        </p>
      </div>

      {/* Analysis Cards */}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {/* Total Cost */}
        <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Total Spending
          </p>

          <p className="mt-3 text-3xl font-bold text-blue-600">
            ${analysis.totalCost.toLocaleString()}
          </p>

          <p className="mt-2 text-sm text-slate-500">
            Across {billingData.length} billing records
          </p>
        </div>

        {/* Average */}
        <div className="rounded-2xl border border-green-100 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Average Record Cost
          </p>

          <p className="mt-3 text-3xl font-bold text-green-600">
            ${analysis.averageCost.toFixed(2)}
          </p>

          <p className="mt-2 text-sm text-slate-500">
            Average cost per billing record
          </p>
        </div>

        {/* Highest Service */}
        <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Highest Cost Service
          </p>

          <p className="mt-3 text-xl font-bold text-orange-600">
            {analysis.highestService}
          </p>

          <p className="mt-2 text-sm text-slate-500">
            ${analysis.highestServiceCost.toLocaleString()} total spending
          </p>
        </div>

        {/* Highest Day */}
        <div className="rounded-2xl border border-red-100 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Highest Cost Day
          </p>

          <p className="mt-3 text-xl font-bold text-red-600">
            {analysis.highestCostDay}
          </p>

          <p className="mt-2 text-sm text-slate-500">
            ${analysis.highestDayCost.toLocaleString()} spending
          </p>
        </div>
      </div>

      {/* Provider + Service Analysis */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Provider Analysis */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900">
            Cloud Provider Spending
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Total spending grouped by cloud provider.
          </p>

          <div className="mt-6 space-y-4">
            {providerEntries.map(([provider, cost]) => {
              const percentage =
                analysis.totalCost > 0
                  ? (cost / analysis.totalCost) * 100
                  : 0;

              return (
                <div key={provider}>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-medium text-slate-700">
                      {provider}
                    </span>

                    <span className="font-semibold text-slate-900">
                      ${cost.toLocaleString()}
                    </span>
                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-blue-600 transition-all"
                      style={{
                        width: `${percentage}%`,
                      }}
                    />
                  </div>

                  <p className="mt-1 text-xs text-slate-400">
                    {percentage.toFixed(1)}% of total spending
                  </p>
                </div>
              );
            })}
          </div>

          {highestProvider && (
            <div className="mt-6 rounded-xl bg-blue-50 p-4">
              <p className="text-sm font-semibold text-blue-700">
                Highest spending provider
              </p>

              <p className="mt-1 text-blue-600">
                {highestProvider[0]} accounts for{" "}
                {(
                  (highestProvider[1] / analysis.totalCost) *
                  100
                ).toFixed(1)}
                % of total spending.
              </p>
            </div>
          )}
        </div>

        {/* Service Analysis */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900">
            Service Cost Analysis
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Services ranked by total cloud spending.
          </p>

          <div className="mt-6 space-y-3">
            {serviceEntries.map(([service, cost], index) => {
              const percentage =
                analysis.totalCost > 0
                  ? (cost / analysis.totalCost) * 100
                  : 0;

              return (
                <div
                  key={service}
                  className="flex items-center justify-between rounded-xl bg-slate-50 p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-sm font-bold text-blue-600">
                      {index + 1}
                    </div>

                    <div>
                      <p className="font-semibold text-slate-800">
                        {service}
                      </p>

                      <p className="text-xs text-slate-500">
                        {percentage.toFixed(1)}% of total
                      </p>
                    </div>
                  </div>

                  <p className="font-bold text-slate-900">
                    ${cost.toLocaleString()}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Automatic Insight */}
      <div className="mt-6 rounded-2xl border border-yellow-200 bg-yellow-50 p-6">
        <div className="flex items-start gap-4">
          <div className="text-3xl">
            AI
          </div>

          <div>
            <h3 className="text-lg font-bold text-yellow-800">
              CloudSense AI Insight
            </h3>

            <p className="mt-2 text-sm leading-6 text-yellow-700">
              {analysis.highestService} is currently the highest-cost
              service in the imported billing data, with total spending
              of ${analysis.highestServiceCost.toLocaleString()}.
              This service should be reviewed for possible
              optimization opportunities.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BillingInsights;