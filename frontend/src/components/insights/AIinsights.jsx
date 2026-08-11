import {
  Sparkles,
  TrendingUp,
  Database,
  PiggyBank,
} from "lucide-react";

import { dashboardInsights } from "../../data/costdata";

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
        {dashboardInsights.map((item) => {
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