import {
  Lightbulb,
  ArrowRight,
  TrendingDown,
} from "lucide-react";

import {
  recommendations,
  currencySymbol,
} from "../../data/costdata";

function Recommendations() {
  const totalSavings = recommendations.reduce(
    (sum, item) => sum + item.savings,
    0
  );

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
            <Lightbulb size={20} />
          </div>

          <div>
            <h2 className="text-base font-bold text-slate-900">
              AI Recommendations
            </h2>

            <p className="text-xs text-slate-500">
              Optimization opportunities identified by CloudSense AI
            </p>
          </div>
        </div>

        <div className="rounded-xl bg-emerald-50 px-3 py-2">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-emerald-600">
            Potential Savings
          </p>

          <p className="text-sm font-bold text-emerald-700">
            {currencySymbol}
            {totalSavings.toLocaleString()}/month
          </p>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {recommendations.map((item) => (
          <div
            key={item.title}
            className="group rounded-xl border border-slate-200 p-4 transition hover:border-blue-200 hover:bg-blue-50/30"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <TrendingDown size={16} />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    {item.title}
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    {item.description}
                  </p>
                </div>
              </div>

              <ArrowRight
                size={17}
                className="shrink-0 text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-500"
              />
            </div>

            <div className="mt-3 flex items-center justify-between">
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold uppercase text-slate-500">
                {item.priority} Priority
              </span>

              <span className="text-sm font-bold text-emerald-600">
                +{currencySymbol}
                {item.savings.toLocaleString()}/mo
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Recommendations;