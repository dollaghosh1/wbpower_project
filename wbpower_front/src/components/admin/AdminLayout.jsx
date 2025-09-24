import { Outlet, useLocation } from "react-router-dom";
import { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import Header from "./AdminHeader";
import Footer from "./AdminFooter";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const isPublicPage = location.pathname === "/login";

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Sidebar */}
      {!isPublicPage && (
        <AdminSidebar
          sidebarOpen={sidebarOpen}
          closeSidebar={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
     <div className={`flex flex-col flex-1 h-screen overflow-y-auto ${isPublicPage ? "w-full" : ""}`}>
  {/* Header (sticky, not scrollable) */}
  {!isPublicPage && (
    <Header setSidebarOpen={setSidebarOpen} />
  )}

  {/* Main (scrollable content area) */}
  <main className="flex-1  mt-16 md:mt-0 bg-gray-100 px-5">
    <Outlet />
  </main>

  {/* Footer (sticky, not scrollable) */}
  {!isPublicPage && <Footer />}
</div>

    </div>
  );
};

export default AdminLayout;