import React, { useState } from "react";
import Head from "next/head";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/router";
import Link from "next/link";
import { useForm } from "react-hook-form";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiEdit,
  FiSave,
  FiX,
  FiCalendar,
  FiClock,
} from "react-icons/fi";
import { toast } from "react-toastify";

const ProfilePage = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      username: user?.username || "",
      email: user?.email || "",
      phone: "",
      address: "",
      dateOfBirth: "",
    },
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Please Login
          </h1>
          <p className="text-gray-600 mb-4">
            You need to be logged in to view your profile.
          </p>
          <Link
            href="/auth/login?redirect=/profile"
            className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // In a real application, you would send this data to your backend API
      console.log("Profile update data:", data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  return (
    <>
      <Head>
        <title>My Profile - HealthCare</title>
        <meta
          name="description"
          content="Manage your profile and account settings"
        />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-6">
              <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
              <div className="flex items-center space-x-3">
                <Link
                  href="/booking/history"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  My Appointments
                </Link>
                <button
                  onClick={logout}
                  className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiUser className="h-12 w-12 text-primary-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {user?.username}
                </h2>
                <p className="text-gray-600 mb-4">{user?.email}</p>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center justify-center">
                    <FiCalendar className="h-4 w-4 mr-2" />
                    <span>Joined: {new Date().getFullYear()}</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <FiClock className="h-4 w-4 mr-2" />
                    <span>Last login: Today</span>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Quick Stats
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Appointments</span>
                    <span className="font-semibold text-gray-900">
                      {
                        JSON.parse(
                          localStorage.getItem("bookings") || "[]"
                        ).filter((b) => b.email === user?.email).length
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Upcoming</span>
                    <span className="font-semibold text-gray-900">
                      {
                        JSON.parse(
                          localStorage.getItem("bookings") || "[]"
                        ).filter(
                          (b) =>
                            b.email === user?.email &&
                            new Date(b.appointmentDate) >= new Date()
                        ).length
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Completed</span>
                    <span className="font-semibold text-gray-900">
                      {
                        JSON.parse(
                          localStorage.getItem("bookings") || "[]"
                        ).filter(
                          (b) =>
                            b.email === user?.email &&
                            new Date(b.appointmentDate) < new Date()
                        ).length
                      }
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Personal Information
                    </h3>
                    {!isEditing && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center text-primary-600 hover:text-primary-700"
                      >
                        <FiEdit className="h-4 w-4 mr-2" />
                        Edit Profile
                      </button>
                    )}
                  </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-6">
                  <div className="space-y-6">
                    {/* Username */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <FiUser className="inline h-4 w-4 mr-2" />
                        Username
                      </label>
                      {isEditing ? (
                        <input
                          {...register("username", {
                            required: "Username is required",
                          })}
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      ) : (
                        <p className="py-2 text-gray-900">
                          {user?.username || "Not set"}
                        </p>
                      )}
                      {errors.username && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.username.message}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <FiMail className="inline h-4 w-4 mr-2" />
                        Email Address
                      </label>
                      <p className="py-2 text-gray-900">{user?.email}</p>
                      <p className="text-sm text-gray-500">
                        Email cannot be changed
                      </p>
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <FiPhone className="inline h-4 w-4 mr-2" />
                        Phone Number
                      </label>
                      {isEditing ? (
                        <input
                          {...register("phone")}
                          type="tel"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="Enter your phone number"
                        />
                      ) : (
                        <p className="py-2 text-gray-900">Not set</p>
                      )}
                    </div>

                    {/* Address */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <FiMapPin className="inline h-4 w-4 mr-2" />
                        Address
                      </label>
                      {isEditing ? (
                        <textarea
                          {...register("address")}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="Enter your address"
                        />
                      ) : (
                        <p className="py-2 text-gray-900">Not set</p>
                      )}
                    </div>

                    {/* Date of Birth */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <FiCalendar className="inline h-4 w-4 mr-2" />
                        Date of Birth
                      </label>
                      {isEditing ? (
                        <input
                          {...register("dateOfBirth")}
                          type="date"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      ) : (
                        <p className="py-2 text-gray-900">Not set</p>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {isEditing && (
                    <div className="flex items-center justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                      >
                        <FiX className="h-4 w-4 mr-2" />
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 disabled:opacity-50"
                      >
                        <FiSave className="h-4 w-4 mr-2" />
                        {loading ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  )}
                </form>
              </div>

              {/* Account Settings */}
              <div className="bg-white rounded-lg shadow-sm mt-6">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Account Settings
                  </h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">
                          Email Verification
                        </p>
                        <p className="text-sm text-gray-600">
                          Your email is verified
                        </p>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Verified
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">
                          Account Status
                        </p>
                        <p className="text-sm text-gray-600">
                          Your account is active
                        </p>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
