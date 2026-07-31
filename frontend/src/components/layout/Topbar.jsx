function Topbar() {
  return (
    <header className="h-20 bg-white shadow-sm border-b border-slate-200 flex items-center justify-between px-8">
      {/* Left */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800">
          Dashboard
        </h2>

        <p className="text-sm text-slate-500">
          Monitor your cloud spending in real time
        </p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-6">
        <button className="text-2xl hover:scale-110 transition">
          🔔
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
            S
          </div>

          <div>
            <p className="font-semibold text-slate-800">
              Sai
            </p>

            <p className="text-sm text-slate-500">
              Administrator
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Topbar;