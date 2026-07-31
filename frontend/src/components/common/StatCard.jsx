function StatCard({
  icon,
  title,
  value,
  colour,
  growth,
}) {
  return (
    <div
      className="bg-white rounded-2xl shadow-lg p-6 border-l-[6px] hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
      style={{
        borderColor: colour,
      }}
    >
      <div className="flex justify-between items-center">
        <div className="text-4xl">
          {icon}
        </div>

        <div className="text-green-600 font-semibold">
          {growth}
        </div>
      </div>

      <h3 className="text-slate-500 mt-5 uppercase tracking-wide text-sm">
        {title}
      </h3>

      <h1 className="text-3xl font-bold mt-3 text-slate-800">
        {value}
      </h1>
    </div>
  );
}

export default StatCard;