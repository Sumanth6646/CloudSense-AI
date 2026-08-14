import { useLocation } from "react-router-dom";

function Topbar() {
  const location = useLocation();

  const pageInfo = {
    "/dashboard": {
      title: "Cloud Overview",
      subtitle: "Monitor your cloud spending and performance",
    },

    "/billing": {
      title: "Billing Import",
      subtitle: "Import and validate your cloud billing data",
    },

    "/analytics": {
      title: "Cost Analytics",
      subtitle: "Analyze your cloud spending patterns",
    },

    "/anomalies": {
      title: "Anomaly Detection",
      subtitle: "Identify unusual cloud spending behavior",
    },

    "/forecast": {
      title: "Cost Forecast",
      subtitle: "Predict future cloud spending",
    },

    "/recommendations": {
      title: "AI Recommendations",
      subtitle: "Discover opportunities to reduce cloud costs",
    },

    "/reports": {
      title: "Reports",
      subtitle: "Generate and review cloud cost reports",
    },

    "/ai-assistant": {
      title: "AI Assistant",
      subtitle: "Ask questions about your cloud spending",
    },

    "/settings": {
      title: "Settings",
      subtitle: "Manage your CloudSense AI preferences",
    },
  };

  const currentPage = pageInfo[location.pathname] || pageInfo["/dashboard"];

  return (
    <header className="h-20 bg-white border-b border-slate-200 shadow-sm flex items-center justify-between px-8">
      
      {/* Left Side */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800">
          {currentPage.title}
        </h2>

        <p className="text-sm text-slate-500 mt-1">
          {currentPage.subtitle}
        </p>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-6">

        {/* Search */}
        <div className="hidden md:flex items-center w-64 h-11 bg-slate-50 border border-slate-200 rounded-xl px-4">
          <span className="text-slate-400 mr-2">
            🔍
          </span>

          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none text-sm text-slate-700 w-full"
          />

          <span className="text-xs text-slate-400 border border-slate-200 rounded px-1.5 py-0.5">
            /
          </span>
        </div>

        {/* Notification */}
        <button
          className="relative text-xl text-slate-600 hover:text-blue-600 transition"
          title="Notifications"
        >
          🔔

          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white">
          </span>
        </button>

        {/* User */}
        <div className="flex items-center gap-3">

          <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
            S
          </div>

          <div className="hidden sm:block">
            <p className="font-semibold text-slate-800">
              Sai
            </p>

            <p className="text-xs text-slate-500">
              Administrator
            </p>
          </div>

          <span className="text-slate-400">
            ▾
          </span>

        </div>

      </div>
    </header>
  );
}

export default Topbar;