import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  FiCalendar,
  FiClock,
  FiUser,
  FiPhone,
  FiMail,
  FiEye,
  FiX,
  FiCheck,
  FiAlertCircle,
} from "react-icons/fi";
import { formatDate, formatTime, getTimeAgo } from "../../lib/utils";
import Modal from "../common/Modal";
import Button from "../ui/Button";
import LoadingSpinner from "../common/LoadingSpinner";

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchBookings();
    }
  }, [isAuthenticated, filter]);

  const fetchBookings = () => {
    try {
      setLoading(true);
      // Get bookings from localStorage (in production, this would come from your backend)
      const allBookings = JSON.parse(localStorage.getItem("bookings") || "[]");

      // Filter bookings for current user
      let userBookings = allBookings.filter(
        (booking) => booking.email === user?.email
      );

      // Apply status filter
      if (filter !== "all") {
        userBookings = userBookings.filter((booking) => {
          switch (filter) {
            case "upcoming":
              return (
                new Date(booking.appointmentDate) >= new Date() &&
                booking.status !== "cancelled"
              );
            case "past":
              return (
                new Date(booking.appointmentDate) < new Date() ||
                booking.status === "completed"
              );
            case "cancelled":
              return booking.status === "cancelled";
            case "pending":
              return booking.status === "pending" || !booking.status;
            case "confirmed":
              return booking.status === "confirmed";
            default:
              return true;
          }
        });
      }

      // Sort by appointment date (newest first)
      userBookings.sort(
        (a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate)
      );

      setBookings(userBookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (booking) => {
    const now = new Date();
    const appointmentDate = new Date(booking.appointmentDate);
    let status = booking.status || "pending";

    // Auto-determine status based on date if not set
    if (!booking.status) {
      if (appointmentDate < now) {
        status = "completed";
      }
    }

    const statusConfig = {
      pending: {
        color: "bg-yellow-100 text-yellow-800",
        icon: FiClock,
        label: "Pending",
      },
      confirmed: {
        color: "bg-green-100 text-green-800",
        icon: FiCheck,
        label: "Confirmed",
      },
      completed: {
        color: "bg-blue-100 text-blue-800",
        icon: FiCheck,
        label: "Completed",
      },
      cancelled: {
        color: "bg-red-100 text-red-800",
        icon: FiX,
        label: "Cancelled",
      },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const StatusIcon = config.icon;

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}
      >
        <StatusIcon className="h-3 w-3 mr-1" />
        {config.label}
      </span>
    );
  };

  const canCancelBooking = (booking) => {
    const appointmentDate = new Date(booking.appointmentDate);
    const now = new Date();
    const hoursUntilAppointment = (appointmentDate - now) / (1000 * 60 * 60);

    return (
      hoursUntilAppointment > 24 &&
      booking.status !== "cancelled" &&
      booking.status !== "completed"
    );
  };

  const canRescheduleBooking = (booking) => {
    const appointmentDate = new Date(booking.appointmentDate);
    const now = new Date();
    const hoursUntilAppointment = (appointmentDate - now) / (1000 * 60 * 60);

    return (
      hoursUntilAppointment > 24 &&
      booking.status !== "cancelled" &&
      booking.status !== "completed"
    );
  };

  const handleCancelBooking = (booking) => {
    setSelectedBooking(booking);
    setCancelModalOpen(true);
  };

  const confirmCancelBooking = () => {
    if (!selectedBooking) return;

    try {
      const allBookings = JSON.parse(localStorage.getItem("bookings") || "[]");
      const updatedBookings = allBookings.map((booking) =>
        booking.id === selectedBooking.id
          ? {
              ...booking,
              status: "cancelled",
              cancelledAt: new Date().toISOString(),
            }
          : booking
      );

      localStorage.setItem("bookings", JSON.stringify(updatedBookings));
      setCancelModalOpen(false);
      setSelectedBooking(null);
      fetchBookings(); // Refresh the list
    } catch (error) {
      console.error("Error cancelling booking:", error);
    }
  };

  const handleViewBooking = (booking) => {
    setSelectedBooking(booking);
    setViewModalOpen(true);
  };

  const filterOptions = [
    { key: "all", label: "All Appointments", count: bookings.length },
    {
      key: "upcoming",
      label: "Upcoming",
      count: bookings.filter(
        (b) =>
          new Date(b.appointmentDate) >= new Date() && b.status !== "cancelled"
      ).length,
    },
    {
      key: "past",
      label: "Past",
      count: bookings.filter(
        (b) =>
          new Date(b.appointmentDate) < new Date() || b.status === "completed"
      ).length,
    },
    {
      key: "cancelled",
      label: "Cancelled",
      count: bookings.filter((b) => b.status === "cancelled").length,
    },
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FiAlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Please Login
          </h2>
          <p className="text-gray-600">
            You need to be logged in to view your booking history.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          My Appointments
        </h1>
        <p className="text-gray-600">
          Track and manage your healthcare appointments
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {filterOptions.map((option) => (
            <button
              key={option.key}
              onClick={() => setFilter(option.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === option.key
                  ? "bg-primary-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {option.label}
              {option.count > 0 && (
                <span className="ml-2 px-2 py-0.5 rounded-full bg-white/20 text-xs">
                  {option.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {/* Bookings List */}
      {!loading && (
        <>
          {bookings.length > 0 ? (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    {/* Booking Info */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {booking.doctorName}
                        </h3>
                        {getStatusBadge(booking)}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <FiCalendar className="h-4 w-4 mr-2" />
                          <span>{formatDate(booking.appointmentDate)}</span>
                        </div>

                        <div className="flex items-center text-sm text-gray-600">
                          <FiClock className="h-4 w-4 mr-2" />
                          <span>{booking.timeSlot}</span>
                        </div>

                        <div className="flex items-center text-sm text-gray-600">
                          <FiUser className="h-4 w-4 mr-2" />
                          <span>₹{booking.consultationFee}</span>
                        </div>
                      </div>

                      <div className="flex items-center text-xs text-gray-500">
                        <span>
                          Booked {getTimeAgo(booking.createdAt)} • ID:{" "}
                          {booking.id}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2 mt-4 lg:mt-0 lg:ml-6">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewBooking(booking)}
                      >
                        <FiEye className="h-4 w-4 mr-1" />
                        View
                      </Button>

                      {canRescheduleBooking(booking) && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            // In a real app, this would open a reschedule modal
                            alert(
                              "Reschedule functionality would be implemented here"
                            );
                          }}
                        >
                          Reschedule
                        </Button>
                      )}

                      {canCancelBooking(booking) && (
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleCancelBooking(booking)}
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FiCalendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {filter === "all"
                  ? "No appointments found"
                  : `No ${filter} appointments`}
              </h3>
              <p className="text-gray-500 mb-6">
                {filter === "all"
                  ? "You haven't booked any appointments yet."
                  : `You don't have any ${filter} appointments.`}
              </p>
              <Button onClick={() => (window.location.href = "/doctors")}>
                Book Your First Appointment
              </Button>
            </div>
          )}
        </>
      )}

      {/* View Booking Modal */}
      <Modal
        isOpen={viewModalOpen}
        onClose={() => {
          setViewModalOpen(false);
          setSelectedBooking(null);
        }}
        title="Appointment Details"
        size="lg"
      >
        {selectedBooking && (
          <div className="space-y-6">
            {/* Doctor Info */}
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                <FiUser className="h-8 w-8 text-primary-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedBooking.doctorName}
                </h3>
                <p className="text-gray-600">Specialist Doctor</p>
              </div>
            </div>

            {/* Appointment Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <p className="text-gray-900">
                    {formatDate(selectedBooking.appointmentDate)}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time
                  </label>
                  <p className="text-gray-900">{selectedBooking.timeSlot}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <div>{getStatusBadge(selectedBooking)}</div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Patient
                  </label>
                  <p className="text-gray-900">{selectedBooking.patientName}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact
                  </label>
                  <p className="text-gray-900">{selectedBooking.phone}</p>
                  <p className="text-gray-500 text-sm">
                    {selectedBooking.email}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Consultation Fee
                  </label>
                  <p className="text-gray-900">
                    ₹{selectedBooking.consultationFee}
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            {selectedBooking.appointmentType && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Appointment Type
                </label>
                <p className="text-gray-900 capitalize">
                  {selectedBooking.appointmentType.replace("-", " ")}
                </p>
              </div>
            )}

            {selectedBooking.symptoms && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Symptoms/Notes
                </label>
                <p className="text-gray-900">{selectedBooking.symptoms}</p>
              </div>
            )}

            {/* Booking Reference */}
            <div className="border-t border-gray-200 pt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Booking Reference
              </label>
              <p className="font-mono text-sm text-gray-900">
                {selectedBooking.id}
              </p>
            </div>
          </div>
        )}
      </Modal>

      {/* Cancel Booking Modal */}
      <Modal
        isOpen={cancelModalOpen}
        onClose={() => {
          setCancelModalOpen(false);
          setSelectedBooking(null);
        }}
        title="Cancel Appointment"
        size="sm"
      >
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <FiAlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Cancel Appointment?
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            Are you sure you want to cancel this appointment with{" "}
            {selectedBooking?.doctorName}? This action cannot be undone.
          </p>
          <div className="flex justify-center space-x-3">
            <Button
              variant="secondary"
              onClick={() => {
                setCancelModalOpen(false);
                setSelectedBooking(null);
              }}
            >
              Keep Appointment
            </Button>
            <Button variant="danger" onClick={confirmCancelBooking}>
              Cancel Appointment
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BookingHistory;
