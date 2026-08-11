import {
  Menu,
  Search,
  Bell,
  ChevronDown,
} from "lucide-react";

function Topbar({ onMenuClick }) {
  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white/95 px-4 shadow-sm backdrop-blur md:px-6 lg:px-8">
      {/* Left */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 lg:hidden"
          aria-label="Open navigation"
        >
          <Menu size={22} />
        </button>

        <div>
          <h2 className="text-lg font-bold text-slate-900 md:text-xl">
            Cloud Overview
          </h2>

          <p className="hidden text-sm text-slate-500 sm:block">
            Monitor your cloud spending and performance
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 md:gap-5">
        {/* Search */}
        <div className="hidden items-center rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 md:flex">
          <Search size={17} className="text-slate-400" />

          <input
            type="text"
            placeholder="Search..."
            className="ml-2 w-36 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 lg:w-48"
          />

          <span className="ml-3 hidden rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-slate-400 lg:block">
            /
          </span>
        </div>

        {/* Mobile search */}
        <button
          type="button"
          className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 md:hidden"
          aria-label="Search"
        >
          <Search size={20} />
        </button>

        {/* Notifications */}
        <button
          type="button"
          className="relative rounded-xl p-2 text-slate-500 transition hover:bg-slate-100"
          aria-label="Notifications"
        >
          <Bell size={20} />

          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>

        {/* Profile */}
        <button
          type="button"
          className="flex items-center gap-2 rounded-xl p-1.5 transition hover:bg-slate-50"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
            S
          </div>

          <div className="hidden text-left md:block">
            <p className="text-sm font-semibold text-slate-800">
              Sai
            </p>

            <p className="text-xs text-slate-500">
              Administrator
            </p>
          </div>

          <ChevronDown
            size={16}
            className="hidden text-slate-400 md:block"
          />
        </button>
      </div>
    </header>
  );
}

export default Topbar;