import React from "react";
import {
  FiUsers,
  FiUserCheck,
  FiBuilding,
  FiShoppingBag,
  FiTrendingUp,
  FiTrendingDown,
} from "react-icons/fi";

const DashboardStats = ({ stats, loading }) => {
  const statCards = [
    {
      title: "Total Doctors",
      value: stats.doctors || 0,
      icon: FiUserCheck,
      color: "blue",
      change: "+12%",
      changeType: "increase",
    },
    {
      title: "Total Patients",
      value: stats.patients || 0,
      icon: FiUsers,
      color: "green",
      change: "+8%",
      changeType: "increase",
    },
    {
      title: "Total Clinics",
      value: stats.clinics || 0,
      icon: FiBuilding,
      color: "purple",
      change: "+5%",
      changeType: "increase",
    },
    {
      title: "Total Pharmacies",
      value: stats.pharmacies || 0,
      icon: FiShoppingBag,
      color: "orange",
      change: "+3%",
      changeType: "increase",
    },
  ];

  const getColorClasses = (color) => {
    const colorMap = {
      blue: {
        bg: "bg-blue-500",
        text: "text-blue-600",
        lightBg: "bg-blue-50",
      },
      green: {
        bg: "bg-green-500",
        text: "text-green-600",
        lightBg: "bg-green-50",
      },
      purple: {
        bg: "bg-purple-500",
        text: "text-purple-600",
        lightBg: "bg-purple-50",
      },
      orange: {
        bg: "bg-orange-500",
        text: "text-orange-600",
        lightBg: "bg-orange-50",
      },
    };
    return colorMap[color] || colorMap.blue;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((card, index) => {
        const colors = getColorClasses(card.color);

        return (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`w-12 h-12 ${colors.lightBg} rounded-lg flex items-center justify-center`}
              >
                <card.icon className={`h-6 w-6 ${colors.text}`} />
              </div>
              <div className="flex items-center text-sm">
                {card.changeType === "increase" ? (
                  <FiTrendingUp className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <FiTrendingDown className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span
                  className={`font-medium ${
                    card.changeType === "increase"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {card.change}
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                {card.title}
              </h3>
              <p className="text-2xl font-bold text-gray-900">
                {loading ? "..." : card.value.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 mt-1">from last month</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardStats;
