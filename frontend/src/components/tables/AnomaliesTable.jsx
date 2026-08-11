import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
} from "lucide-react";

import {
  anomalies,
  currencySymbol,
} from "../../data/costdata";

const severityConfig = {
  Critical: {
    className: "bg-red-50 text-red-700 ring-red-600/10",
  },
  High: {
    className: "bg-orange-50 text-orange-700 ring-orange-600/10",
  },
  Medium: {
    className: "bg-amber-50 text-amber-700 ring-amber-600/10",
  },
  Low: {
    className: "bg-emerald-50 text-emerald-700 ring-emerald-600/10",
  },
};

const statusConfig = {
  Open: {
    icon: AlertTriangle,
    className: "text-red-600",
  },
  Investigating: {
    icon: Clock3,
    className: "text-amber-600",
  },
  Resolved: {
    icon: CheckCircle2,
    className: "text-emerald-600",
  },
};

function AnomaliesTable() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-5 md:p-6">
        <div>
          <div className="flex items-center gap-2">
            <AlertTriangle
              size={19}
              className="text-red-500"
            />

            <h2 className="text-base font-bold text-slate-900">
              Recent Cost Anomalies
            </h2>
          </div>

          <p className="mt-1 text-xs text-slate-500">
            Unusual spending patterns detected in your cloud account
          </p>
        </div>

        <button
          type="button"
          className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
        >
          View All
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] text-left">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70">
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Date
              </th>

              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Cloud Service
              </th>

              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Cost
              </th>

              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Severity
              </th>

              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {anomalies.map((item) => {
              const severity =
                severityConfig[item.severity] ||
                severityConfig.Low;

              const status =
                statusConfig[item.status] ||
                statusConfig.Open;

              const StatusIcon = status.icon;

              return (
                <tr
                  key={`${item.date}-${item.service}`}
                  className="border-b border-slate-100 last:border-0 transition hover:bg-slate-50"
                >
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {item.date}
                  </td>

                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-slate-800">
                      {item.service}
                    </p>
                  </td>

                  <td className="px-6 py-4 text-sm font-semibold text-slate-800">
                    {currencySymbol}
                    {item.cost.toLocaleString()}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${severity.className}`}
                    >
                      {item.severity}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div
                      className={`flex items-center gap-2 text-sm font-medium ${status.className}`}
                    >
                      <StatusIcon size={15} />
                      {item.status}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default AnomaliesTable;