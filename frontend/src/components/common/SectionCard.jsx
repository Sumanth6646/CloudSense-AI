function SectionCard({ title, subtitle = "", children }) {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6 hover:shadow-lg transition-all duration-300">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-slate-800">
          {title}
        </h2>

        {subtitle && (
          <p className="text-sm text-slate-500 mt-1">
            {subtitle}
          </p>
        )}
      </div>

      {children}
    </div>
  );
}

export default SectionCard;