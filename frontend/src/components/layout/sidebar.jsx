function Sidebar() {
  const menuItems = [
    "📊 Dashboard",
    "📂 Billing Import",
    "📈 Analytics",
    "🚨 Anomalies",
    "🔮 Forecast",
    "💡 Recommendations",
    "📄 Reports",
    "⚙ Settings",
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white shadow-xl flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-2xl font-bold text-blue-400">
          ☁ CloudSense AI
        </h1>

        <p className="text-sm text-slate-400 mt-2">
          Cloud Cost Intelligence
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        {menuItems.map((item, index) => (
          <div
            key={index}
            className="mb-2 rounded-lg px-4 py-3 cursor-pointer transition-all duration-200 hover:bg-blue-600 hover:translate-x-1"
          >
            {item}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-700 p-4 text-sm text-slate-400">
        Version 1.0.0
      </div>
    </aside>
  );
}

export default Sidebar;