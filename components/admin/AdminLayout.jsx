import React from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/router";
import AdminSidebar from "./AdminSidebar";
import { FiMenu, FiX, FiBell, FiUser, FiLogOut } from "react-icons/fi";
import { useState, useEffect } from "react";

const AdminLayout = ({ children, title }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login?redirect=" + encodeURIComponent(router.asPath));
      return;
    }

    // Check if user is admin (you can modify this logic based on your user roles)
    if (user && user.role !== "admin") {
      router.push("/");
      return;
    }
  }, [isAuthenticated, user, router]);

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  if (!isAuthenticated || (user && user.role !== "admin")) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking permissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Navigation */}
        <div className="sticky top-0 z-40 lg:mx-auto lg:max-w-7xl lg:px-8">
          <div className="flex h-16 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-0 lg:shadow-none">
            <button
              type="button"
              className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <FiMenu className="h-6 w-6" />
            </button>

            {/* Separator */}
            <div className="h-6 w-px bg-gray-200 lg:hidden" />

            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
              <div className="relative flex flex-1 items-center">
                <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
              </div>

              <div className="flex items-center gap-x-4 lg:gap-x-6">
                {/* Notifications */}
                <button
                  type="button"
                  className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">View notifications</span>
                  <FiBell className="h-6 w-6" />
                </button>

                {/* Separator */}
                <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" />

                {/* Profile dropdown */}
                <div className="relative">
                  <div className="flex items-center gap-x-2">
                    <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center">
                      <FiUser className="h-4 w-4 text-white" />
                    </div>
                    <span className="hidden lg:flex lg:items-center">
                      <span className="ml-2 text-sm font-semibold leading-6 text-gray-900">
                        {user?.username}
                      </span>
                    </span>
                    <button
                      onClick={handleLogout}
                      className="ml-2 p-1.5 text-gray-400 hover:text-gray-500"
                      title="Logout"
                    >
                      <FiLogOut className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <main className="py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>

      {/* Sidebar backdrop for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-25 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;
