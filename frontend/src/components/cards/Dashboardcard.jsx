function DashboardCard({
  title,
  value,
  colour,
  icon: Icon,
  trend,
  trendType = "positive",
  subtitle,
}) {
  return (
    <div
      className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg md:p-6"
      style={{
        borderLeft: `4px solid ${colour}`,
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {title}
          </p>

          <h3 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
            {value}
          </h3>

          {trend && (
            <div className="mt-3 flex items-center gap-2">
              <span
                className={`text-xs font-semibold ${
                  trendType === "negative"
                    ? "text-red-600"
                    : trendType === "warning"
                      ? "text-amber-600"
                      : "text-emerald-600"
                }`}
              >
                {trend}
              </span>

              {subtitle && (
                <span className="text-xs text-slate-400">
                  {subtitle}
                </span>
              )}
            </div>
          )}
        </div>

        {Icon && (
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
            style={{
              backgroundColor: `${colour}15`,
              color: colour,
            }}
          >
            <Icon size={21} strokeWidth={2} />
          </div>
        )}
      </div>

      <div
        className="absolute -bottom-8 -right-8 h-24 w-24 rounded-full opacity-[0.04] transition-transform duration-500 group-hover:scale-150"
        style={{
          backgroundColor: colour,
        }}
      />
    </div>
  );
}

export default DashboardCard;