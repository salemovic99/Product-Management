// components/LayoutWrapper.tsx
"use client";
import { useState } from "react";
import Header from "./Header";
import DashboardSideBar from "./DashboardSideBar";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={darkMode ? "dark" : ""}>
      {/* Sidebar for large screens */}
      <div className="hidden lg:block fixed w-64 h-full bg-white dark:bg-gray-800 shadow-md z-30">
        <DashboardSideBar
          darkMode={darkMode}
          sidebarOpen={true}
          setSidebarOpen={setSidebarOpen}
        />
      </div>

      {/* Sidebar for small screens */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed w-64 h-full bg-white dark:bg-gray-800 shadow-md z-50">
            <DashboardSideBar
              darkMode={darkMode}
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
            />
          </div>
        </>
      )}

      {/* Main content */}
      <div className={`flex flex-col min-h-screen ${sidebarOpen ? "overflow-hidden" : ""} lg:ml-64`}>
        <Header
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />
         <main className=" max-w-7xl  w-full">
            {children}
          </main>
      </div>
    </div>
  );
}
