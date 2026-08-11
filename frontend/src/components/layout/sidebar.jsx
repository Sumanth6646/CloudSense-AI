import {
  LayoutDashboard,
  UploadCloud,
  BarChart3,
  AlertTriangle,
  TrendingUp,
  Lightbulb,
  FileText,
  Bot,
  Settings,
  Cloud,
  X,
} from "lucide-react";
import { NavLink } from "react-router-dom";

function Sidebar({ mobileOpen = false, onClose }) {
  const menuGroups = [
    {
      title: "MAIN",
      items: [
        {
          name: "Dashboard",
          path: "/dashboard",
          icon: LayoutDashboard,
        },
        {
          name: "Billing Import",
          path: "/billing",
          icon: UploadCloud,
        },
        {
          name: "Analytics",
          path: "/analytics",
          icon: BarChart3,
        },
      ],
    },
    {
      title: "AI & INSIGHTS",
      items: [
        {
          name: "Anomalies",
          path: "/anomalies",
          icon: AlertTriangle,
        },
        {
          name: "Forecast",
          path: "/forecast",
          icon: TrendingUp,
        },
        {
          name: "Recommendations",
          path: "/recommendations",
          icon: Lightbulb,
        },
        {
          name: "AI Assistant",
          path: "/ai-assistant",
          icon: Bot,
        },
      ],
    },
    {
      title: "MANAGEMENT",
      items: [
        {
          name: "Reports",
          path: "/reports",
          icon: FileText,
        },
        {
          name: "Settings",
          path: "/settings",
          icon: Settings,
        },
      ],
    },
  ];

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/50 lg:hidden"
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex w-72 flex-col
          bg-slate-950 text-white shadow-xl
          transition-transform duration-300
          lg:static lg:translate-x-0
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Brand */}
        <div className="flex h-20 items-center justify-between border-b border-slate-800 px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-600/20">
              <Cloud size={22} strokeWidth={2.2} />
            </div>

            <div>
              <h1 className="text-lg font-bold tracking-tight">
                CloudSense
              </h1>

              <p className="text-xs font-medium text-blue-400">
                AI Cloud Intelligence
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-6">
          {menuGroups.map((group) => (
            <div key={group.title} className="mb-7">
              <p className="mb-3 px-3 text-[11px] font-semibold tracking-widest text-slate-500">
                {group.title}
              </p>

              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;

                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={onClose}
                      className={({ isActive }) =>
                        `
                        group flex items-center gap-3 rounded-xl px-3 py-3
                        text-sm font-medium transition-all duration-200
                        ${
                          isActive
                            ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                            : "text-slate-400 hover:bg-slate-800 hover:text-white"
                        }
                        `
                      }
                    >
                      <Icon
                        size={19}
                        strokeWidth={2}
                        className="shrink-0"
                      />

                      <span>{item.name}</span>
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-slate-800 p-4">
          <div className="rounded-xl bg-slate-900 p-3">
            <p className="text-xs font-medium text-slate-400">
              CloudSense AI
            </p>

            <p className="mt-1 text-xs text-slate-600">
              Version 1.0.0
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;