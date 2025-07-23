import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  FiX,
  FiHome,
  FiUsers,
  FiUserCheck,
  FiBuilding,
  FiShoppingBag,
  FiBarChart3,
  FiSettings,
} from "react-icons/fi";

const AdminSidebar = ({ isOpen, onClose }) => {
  const router = useRouter();

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: FiHome },
    { name: "Doctors", href: "/admin/doctors", icon: FiUserCheck },
    { name: "Patients", href: "/admin/patients", icon: FiUsers },
    { name: "Clinics", href: "/admin/clinics", icon: FiBuilding },
    { name: "Pharmacies", href: "/admin/pharmacies", icon: FiShoppingBag },
    { name: "Analytics", href: "/admin/analytics", icon: FiBarChart3 },
    { name: "Settings", href: "/admin/settings", icon: FiSettings },
  ];

  const isCurrentPath = (path) => {
    if (path === "/admin") {
      return router.pathname === "/admin";
    }
    return router.pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile sidebar */}
      <div className={`relative z-50 lg:hidden ${isOpen ? "" : "hidden"}`}>
        <div className="fixed inset-0 bg-gray-900/80" />
        <div className="fixed inset-0 flex">
          <div className="relative mr-16 flex w-full max-w-xs flex-1">
            <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
              <button type="button" className="-m-2.5 p-2.5" onClick={onClose}>
                <span className="sr-only">Close sidebar</span>
                <FiX className="h-6 w-6 text-white" />
              </button>
            </div>
            <SidebarContent
              navigation={navigation}
              isCurrentPath={isCurrentPath}
              onClose={onClose}
            />
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <SidebarContent navigation={navigation} isCurrentPath={isCurrentPath} />
      </div>
    </>
  );
};

const SidebarContent = ({ navigation, isCurrentPath, onClose }) => (
  <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4 ring-1 ring-white/10">
    <div className="flex h-16 shrink-0 items-center">
      <h1 className="text-xl font-bold text-primary-600">Healthcare Admin</h1>
    </div>
    <nav className="flex flex-1 flex-col">
      <ul role="list" className="flex flex-1 flex-col gap-y-7">
        <li>
          <ul role="list" className="-mx-2 space-y-1">
            {navigation.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={`group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors ${
                    isCurrentPath(item.href)
                      ? "bg-primary-600 text-white"
                      : "text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                  }`}
                >
                  <item.icon
                    className={`h-6 w-6 shrink-0 ${
                      isCurrentPath(item.href)
                        ? "text-white"
                        : "text-gray-400 group-hover:text-primary-600"
                    }`}
                  />
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </li>
      </ul>
    </nav>
  </div>
);

export default AdminSidebar;
