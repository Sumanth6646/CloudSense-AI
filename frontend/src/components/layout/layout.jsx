import { useState } from "react";
import Sidebar from "./sidebar";
import Topbar from "./Topbar";

function Layout({ children }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar
        mobileOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      <div className="flex min-h-screen min-w-0 flex-col lg:ml-64">
        <Topbar
          onMenuClick={() => setMobileSidebarOpen(true)}
        />

        <main className="flex-1 overflow-x-hidden p-4 md:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-[1600px]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Layout;