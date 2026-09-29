import {
  Sparkles,
  TrendingUp,
  Database,
  PiggyBank,
} from "lucide-react";

import { useBillingData } from "../../context/BillingDataContext";

const insightConfig = {
  warning: {
    icon: TrendingUp,
    iconClass: "bg-amber-50 text-amber-600",
    borderClass: "border-amber-200",
  },
  info: {
    icon: Database,
    iconClass: "bg-blue-50 text-blue-600",
    borderClass: "border-blue-200",
  },
  success: {
    icon: PiggyBank,
    iconClass: "bg-emerald-50 text-emerald-600",
    borderClass: "border-emerald-200",
  },
};

function AIInsights() {
  const { billingData, totalCost } = useBillingData();

  const insights = [];

  /*
   * Show a default message when no billing data
   * has been uploaded yet.
   */
  if (billingData.length === 0) {
    insights.push({
      type: "info",
      title: "No billing data available",
      description:
        "Upload a cloud billing CSV file to generate AI-powered cost insights.",
    });
  } else {
    /*
     * Calculate service costs
     */
    const serviceTotals = {};

    billingData.forEach((item) => {
      const service = item.Service || "Unknown";
      const cost = Number(item.Cost || 0);

      serviceTotals[service] =
        (serviceTotals[service] || 0) + cost;
    });

    /*
     * Find highest-cost service
     */
    const highestService = Object.entries(serviceTotals)
      .sort((a, b) => b[1] - a[1])[0];

    if (highestService) {
      const [serviceName, serviceCost] = highestService;

      insights.push({
        type: "warning",
        title: `${serviceName} is your highest-cost service`,
        description: `${serviceName} accounts for $${serviceCost.toLocaleString(
          undefined,
          { maximumFractionDigits: 0 }
        )} of your imported cloud spending.`,
      });
    }

    /*
     * Calculate provider costs
     */
    const providerTotals = {};

    billingData.forEach((item) => {
      const provider = item.Provider || "Unknown";
      const cost = Number(item.Cost || 0);

      providerTotals[provider] =
        (providerTotals[provider] || 0) + cost;
    });

    /*
     * Find highest-cost provider
     */
    const highestProvider = Object.entries(providerTotals)
      .sort((a, b) => b[1] - a[1])[0];

    if (highestProvider) {
      const [providerName, providerCost] = highestProvider;

      insights.push({
        type: "info",
        title: `${providerName} has the highest spending`,
        description: `${providerName} accounts for $${providerCost.toLocaleString(
          undefined,
          { maximumFractionDigits: 0 }
        )} of the imported cloud costs.`,
      });
    }

    /*
     * Temporary savings estimate.
     * This will later be replaced by the
     * ML recommendation engine.
     */
    const estimatedSavings = totalCost * 0.15;

    insights.push({
      type: "success",
      title: "Potential optimization opportunity",
      description: `A preliminary optimization estimate suggests up to $${estimatedSavings.toLocaleString(
        undefined,
        { maximumFractionDigits: 0 }
      )} in potential savings.`,
    });
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
          <Sparkles size={20} />
        </div>

        <div>
          <h2 className="text-base font-bold text-slate-900">
            AI Cost Insights
          </h2>

          <p className="text-xs text-slate-500">
            Automated observations from your cloud data
          </p>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {insights.map((item) => {
          const config =
            insightConfig[item.type] || insightConfig.info;

          const Icon = config.icon;

          return (
            <div
              key={item.title}
              className={`rounded-xl border p-4 ${config.borderClass}`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${config.iconClass}`}
                >
                  <Icon size={18} />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default AIInsights;