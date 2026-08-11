import {
  Cloud,
  Download,
  RefreshCw,
  CalendarDays,
} from "lucide-react";

function DashboardHeader() {
  const today = new Date();

  const formattedDate = today.toLocaleDateString(
    "en-GB",
    {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );

  return (
    <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Cloud size={23} />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                CloudSense AI Dashboard
              </h1>

              <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                <CalendarDays size={14} />
                {formattedDate}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            defaultValue="Last 7 Days"
          >
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>Last 90 Days</option>
            <option>This Year</option>
          </select>

          <button
            type="button"
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            <Download size={16} />
            <span className="hidden sm:inline">
              Export Report
            </span>
          </button>

          <button
            type="button"
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
          >
            <RefreshCw size={16} />
            <span className="hidden sm:inline">
              Refresh
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}

export default DashboardHeader;