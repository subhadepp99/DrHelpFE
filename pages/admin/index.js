import React, { useState, useEffect } from "react";
import Head from "next/head";
import AdminLayout from "../../components/admin/AdminLayout";
import { doctorAPI, patientAPI, clinicAPI, pharmacyAPI } from "../../lib/api";
import {
  FiUsers,
  FiUserCheck,
  FiBuilding,
  FiShoppingBag,
  FiTrendingUp,
  FiCalendar,
} from "react-icons/fi";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    doctors: 0,
    patients: 0,
    clinics: 0,
    pharmacies: 0,
    appointments: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const [doctorsRes, patientsRes, clinicsRes, pharmaciesRes] =
        await Promise.all([
          doctorAPI.getAll({ limit: 1 }),
          patientAPI.getAll({ limit: 1 }),
          clinicAPI.getAll({ limit: 1 }),
          pharmacyAPI.getAll({ limit: 1 }),
        ]);

      const bookings = JSON.parse(localStorage.getItem("bookings") || "[]");

      setStats({
        doctors: doctorsRes.data.total || 0,
        patients: patientsRes.data.total || 0,
        clinics: clinicsRes.data.total || 0,
        pharmacies: pharmaciesRes.data.total || 0,
        appointments: bookings.length,
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Doctors",
      value: stats.doctors,
      icon: FiUserCheck,
      color: "blue",
      href: "/admin/doctors",
    },
    {
      title: "Total Patients",
      value: stats.patients,
      icon: FiUsers,
      color: "green",
      href: "/admin/patients",
    },
    {
      title: "Total Clinics",
      value: stats.clinics,
      icon: FiBuilding,
      color: "purple",
      href: "/admin/clinics",
    },
    {
      title: "Total Pharmacies",
      value: stats.pharmacies,
      icon: FiShoppingBag,
      color: "orange",
      href: "/admin/pharmacies",
    },
  ];

  const getColorClasses = (color) => {
    const colorMap = {
      blue: "bg-blue-500 text-blue-600",
      green: "bg-green-500 text-green-600",
      purple: "bg-purple-500 text-purple-600",
      orange: "bg-orange-500 text-orange-600",
    };
    return colorMap[color] || colorMap.blue;
  };

  return (
    <>
      <Head>
        <title>Admin Dashboard - HealthCare</title>
        <meta name="description" content="Healthcare admin dashboard" />
      </Head>

      <AdminLayout title="Dashboard">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((card) => {
            const colorClasses = getColorClasses(card.color);
            return (
              <div
                key={card.title}
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {card.title}
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {loading ? "..." : card.value.toLocaleString()}
                    </p>
                  </div>
                  <div
                    className={`w-12 h-12 rounded-lg ${
                      colorClasses.split(" ")[0]
                    } ${
                      colorClasses.split(" ")[0]
                    }/10 flex items-center justify-center`}
                  >
                    <card.icon
                      className={`h-6 w-6 ${colorClasses.split(" ")[1]}`}
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center text-sm">
                    <FiTrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-green-500 font-medium">12%</span>
                    <span className="text-gray-500 ml-1">from last month</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Recent Activity
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {[
                  {
                    action: "New doctor registered",
                    name: "Dr. Sarah Johnson",
                    time: "2 hours ago",
                  },
                  {
                    action: "Patient appointment booked",
                    name: "John Smith",
                    time: "4 hours ago",
                  },
                  {
                    action: "Clinic added",
                    name: "City Medical Center",
                    time: "1 day ago",
                  },
                  {
                    action: "Pharmacy registered",
                    name: "HealthPlus Pharmacy",
                    time: "2 days ago",
                  },
                ].map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.action}
                      </p>
                      <p className="text-sm text-gray-500">{activity.name}</p>
                      <p className="text-xs text-gray-400">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Quick Actions
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <button className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                  <FiUserCheck className="h-8 w-8 text-blue-600 mb-2" />
                  <span className="text-sm font-medium text-blue-900">
                    Add Doctor
                  </span>
                </button>

                <button className="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                  <FiUsers className="h-8 w-8 text-green-600 mb-2" />
                  <span className="text-sm font-medium text-green-900">
                    Add Patient
                  </span>
                </button>

                <button className="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                  <FiBuilding className="h-8 w-8 text-purple-600 mb-2" />
                  <span className="text-sm font-medium text-purple-900">
                    Add Clinic
                  </span>
                </button>

                <button className="flex flex-col items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
                  <FiShoppingBag className="h-8 w-8 text-orange-600 mb-2" />
                  <span className="text-sm font-medium text-orange-900">
                    Add Pharmacy
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Appointments */}
        <div className="bg-white rounded-lg shadow-sm mt-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Recent Appointments
              </h3>
              <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                View All
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Doctor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {JSON.parse(localStorage.getItem("bookings") || "[]")
                  .slice(-5)
                  .reverse()
                  .map((booking, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {booking.patientName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {booking.doctorName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(booking.appointmentDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          {booking.status || "Pending"}
                        </span>
                      </td>
                    </tr>
                  ))}
                {JSON.parse(localStorage.getItem("bookings") || "[]").length ===
                  0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      No appointments found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </AdminLayout>
    </>
  );
};

export default AdminDashboard;
