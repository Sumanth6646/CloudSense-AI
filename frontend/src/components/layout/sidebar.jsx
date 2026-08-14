import { NavLink } from "react-router-dom";

function Sidebar() {
  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: "📊",
    },
    {
      name: "Billing Import",
      path: "/billing",
      icon: "📂",
    },
    {
      name: "Analytics",
      path: "/analytics",
      icon: "📈",
    },
    {
      name: "Anomalies",
      path: "/anomalies",
      icon: "🚨",
    },
    {
      name: "Forecast",
      path: "/forecast",
      icon: "🔮",
    },
    {
      name: "Recommendations",
      path: "/recommendations",
      icon: "💡",
    },
    {
      name: "Reports",
      path: "/reports",
      icon: "📄",
    },
    {
      name: "AI Assistant",
      path: "/ai-assistant",
      icon: "🤖",
    },
    {
      name: "Settings",
      path: "/settings",
      icon: "⚙️",
    },
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
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `mb-2 flex items-center gap-3 rounded-lg px-4 py-3 transition-all duration-200 ${
                isActive
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white hover:translate-x-1"
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>

            <span className="font-medium">
              {item.name}
            </span>
          </NavLink>
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