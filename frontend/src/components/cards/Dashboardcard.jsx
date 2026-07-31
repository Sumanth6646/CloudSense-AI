function DashboardCard({ title, value, colour }) {
  return (
    <div
      className="bg-white rounded-2xl shadow-lg p-6 min-w-[240px] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
      style={{
        borderLeft: `6px solid ${colour}`,
      }}
    >
      <h3 className="text-slate-500 text-sm font-semibold uppercase tracking-wide">
        {title}
      </h3>

      <h1 className="text-3xl font-bold text-slate-800 mt-4">
        {value}
      </h1>
    </div>
  );
}

export default DashboardCard;