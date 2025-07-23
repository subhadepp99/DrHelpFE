import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import {
  FiCalendar,
  FiClock,
  FiUser,
  FiPhone,
  FiMail,
  FiEye,
} from "react-icons/fi";

const BookingHistoryPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchBookings();
    }
  }, [isAuthenticated]);

  const fetchBookings = () => {
    try {
      setLoading(true);
      // Get bookings from localStorage (in production, this would come from your backend)
      const allBookings = JSON.parse(localStorage.getItem("bookings") || "[]");

      // Filter bookings for current user (if email matches)
      const userBookings = allBookings.filter(
        (booking) => booking.email === user?.email
      );

      setBookings(userBookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredBookings = () => {
    const now = new Date();

    switch (filter) {
      case "upcoming":
        return bookings.filter(
          (booking) => new Date(booking.appointmentDate) >= now
        );
      case "past":
        return bookings.filter(
          (booking) => new Date(booking.appointmentDate) < now
        );
      case "pending":
        return bookings.filter((booking) => booking.status === "pending");
      case "confirmed":
        return bookings.filter((booking) => booking.status === "confirmed");
      case "cancelled":
        return bookings.filter((booking) => booking.status === "cancelled");
      default:
        return bookings;
    }
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
      completed: "bg-blue-100 text-blue-800",
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          statusStyles[status] || statusStyles.pending
        }`}
      >
        {status ? status.charAt(0).toUpperCase() + status.slice(1) : "Pending"}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Please Login
          </h1>
          <p className="text-gray-600 mb-4">
            You need to be logged in to view your booking history.
          </p>
          <Link
            href="/auth/login?redirect=/booking/history"
            className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Booking History - HealthCare</title>
        <meta
          name="description"
          content="View and manage your appointment bookings"
        />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  My Appointments
                </h1>
                <p className="text-gray-600">
                  Manage your healthcare appointments
                </p>
              </div>
              <Link
                href="/doctors"
                className="mt-4 sm:mt-0 bg-primary-600 text-white px-6 py-2 rounded-md font-medium hover:bg-primary-700"
              >
                Book New Appointment
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex flex-wrap gap-2">
              {[
                { key: "all", label: "All Appointments" },
                { key: "upcoming", label: "Upcoming" },
                { key: "past", label: "Past" },
                { key: "pending", label: "Pending" },
                { key: "confirmed", label: "Confirmed" },
                { key: "cancelled", label: "Cancelled" },
              ].map((filterOption) => (
                <button
                  key={filterOption.key}
                  onClick={() => setFilter(filterOption.key)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    filter === filterOption.key
                      ? "bg-primary-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {filterOption.label}
                </button>
              ))}
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          )}

          {/* Bookings List */}
          {!loading && (
            <>
              {getFilteredBookings().length > 0 ? (
                <div className="space-y-6">
                  {getFilteredBookings().map((booking) => (
                    <div
                      key={booking.id}
                      className="bg-white rounded-lg shadow-sm overflow-hidden"
                    >
                      <div className="p-6">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">
                                {booking.doctorName}
                              </h3>
                              {getStatusBadge(booking.status)}
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                              Booking ID: {booking.id}
                            </p>
                            <p className="text-sm text-gray-600">
                              Booked on: {formatDate(booking.createdAt)}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                          <div className="flex items-center">
                            <FiCalendar className="h-5 w-5 text-gray-400 mr-3" />
                            <div>
                              <p className="text-sm text-gray-600">Date</p>
                              <p className="font-medium text-gray-900">
                                {formatDate(booking.appointmentDate)}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center">
                            <FiClock className="h-5 w-5 text-gray-400 mr-3" />
                            <div>
                              <p className="text-sm text-gray-600">Time</p>
                              <p className="font-medium text-gray-900">
                                {booking.timeSlot}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center">
                            <FiUser className="h-5 w-5 text-gray-400 mr-3" />
                            <div>
                              <p className="text-sm text-gray-600">Patient</p>
                              <p className="font-medium text-gray-900">
                                {booking.patientName}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center">
                            <span className="inline-block w-5 h-5 text-gray-400 mr-3">
                              ₹
                            </span>
                            <div>
                              <p className="text-sm text-gray-600">Fee</p>
                              <p className="font-medium text-gray-900">
                                ₹{booking.consultationFee}
                              </p>
                            </div>
                          </div>
                        </div>

                        {booking.appointmentType && (
                          <div className="mb-4">
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Type:</span>{" "}
                              <span className="capitalize">
                                {booking.appointmentType.replace("-", " ")}
                              </span>
                            </p>
                          </div>
                        )}

                        {booking.symptoms && (
                          <div className="mb-4">
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">
                                Symptoms/Notes:
                              </span>{" "}
                              {booking.symptoms}
                            </p>
                          </div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-gray-100">
                          <Link
                            href={`/booking/confirmation?bookingId=${booking.id}`}
                            className="flex items-center justify-center px-4 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-md hover:bg-primary-100"
                          >
                            <FiEye className="h-4 w-4 mr-2" />
                            View Details
                          </Link>

                          {booking.status === "pending" && (
                            <button className="flex items-center justify-center px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100">
                              Cancel Appointment
                            </button>
                          )}

                          {(booking.status === "confirmed" ||
                            booking.status === "pending") &&
                            new Date(booking.appointmentDate) > new Date() && (
                              <button className="flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200">
                                Reschedule
                              </button>
                            )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                  <div className="w-24 h-24 mx-auto mb-4 text-gray-400">
                    <FiCalendar className="w-full h-full" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {filter === "all"
                      ? "No appointments found"
                      : `No ${filter} appointments`}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {filter === "all"
                      ? "You haven't booked any appointments yet."
                      : `You don't have any ${filter} appointments.`}
                  </p>
                  <Link
                    href="/doctors"
                    className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700"
                  >
                    Book Your First Appointment
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default BookingHistoryPage;
