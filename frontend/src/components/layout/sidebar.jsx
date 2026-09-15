import { NavLink } from "react-router-dom";

function Sidebar({
  mobileOpen = false,
  onClose = () => {},
}) {
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
    <>
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      <aside
        className={`
          fixed left-0 top-0 z-50
          flex h-screen w-64 flex-col
          overflow-y-auto
          bg-slate-900 text-white shadow-xl
          transition-transform duration-300
          lg:translate-x-0
          ${
            mobileOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        <div className="border-b border-slate-700 p-6">
          <h1 className="text-2xl font-bold text-blue-400">
            ☁ CloudSense AI
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Cloud Cost Intelligence
          </p>
        </div>

        <nav className="flex-1 p-4">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `mb-2 flex items-center gap-3 rounded-lg px-4 py-3 transition-all duration-200 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white hover:translate-x-1"
                }`
              }
            >
              <span className="text-lg">
                {item.icon}
              </span>

              <span className="font-medium">
                {item.name}
              </span>
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-slate-700 p-4 text-sm text-slate-400">
          Version 1.0.0
        </div>
      </aside>
    </>
  );
}

export default Sidebar;