import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import {
  FiCheck,
  FiCalendar,
  FiClock,
  FiUser,
  FiPhone,
  FiMail,
} from "react-icons/fi";

const BookingConfirmationPage = () => {
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { bookingId } = router.query;

  useEffect(() => {
    if (bookingId) {
      fetchBooking();
    }
  }, [bookingId]);

  const fetchBooking = () => {
    try {
      setLoading(true);
      // Get booking from localStorage (in production, this would come from your backend)
      const bookings = JSON.parse(localStorage.getItem("bookings") || "[]");
      const foundBooking = bookings.find((b) => b.id === bookingId);

      if (foundBooking) {
        setBooking(foundBooking);
      } else {
        router.push("/");
      }
    } catch (error) {
      console.error("Error fetching booking:", error);
      router.push("/");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading confirmation details...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Booking Not Found
          </h1>
          <p className="text-gray-600 mb-4">
            The booking confirmation you're looking for doesn't exist.
          </p>
          <Link
            href="/"
            className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Booking Confirmed - HealthCare</title>
        <meta
          name="description"
          content="Your appointment has been successfully booked"
        />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Success Header */}
            <div className="bg-green-50 p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiCheck className="h-8 w-8 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-green-800 mb-2">
                Booking Confirmed!
              </h1>
              <p className="text-green-700">
                Your appointment has been successfully booked. You will receive
                a confirmation email shortly.
              </p>
            </div>

            {/* Booking Details */}
            <div className="p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Appointment Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Doctor Information */}
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">
                    Doctor Information
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-semibold text-gray-900 text-lg">
                      {booking.doctorName}
                    </p>
                    <p className="text-gray-600">Specialist Doctor</p>
                  </div>
                </div>

                {/* Patient Information */}
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">
                    Patient Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <FiUser className="h-5 w-5 text-gray-400 mr-3" />
                      <span className="text-gray-700">
                        {booking.patientName}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <FiMail className="h-5 w-5 text-gray-400 mr-3" />
                      <span className="text-gray-700">{booking.email}</span>
                    </div>
                    <div className="flex items-center">
                      <FiPhone className="h-5 w-5 text-gray-400 mr-3" />
                      <span className="text-gray-700">{booking.phone}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Appointment Details */}
              <div className="border-t border-gray-200 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <FiCalendar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-1">Date</p>
                    <p className="font-semibold text-gray-900">
                      {new Date(booking.appointmentDate).toLocaleDateString(
                        "en-US",
                        {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </p>
                  </div>

                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <FiClock className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-1">Time</p>
                    <p className="font-semibold text-gray-900">
                      {booking.timeSlot}
                    </p>
                  </div>

                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <span className="inline-block w-8 h-8 bg-green-100 rounded-full text-green-600 text-lg font-bold mb-2">
                      ₹
                    </span>
                    <p className="text-sm text-gray-600 mb-1">
                      Consultation Fee
                    </p>
                    <p className="font-semibold text-gray-900">
                      ₹{booking.consultationFee}
                    </p>
                  </div>
                </div>
              </div>

              {/* Appointment Type and Symptoms */}
              <div className="border-t border-gray-200 pt-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Appointment Type
                    </h4>
                    <p className="text-gray-600 capitalize">
                      {booking.appointmentType?.replace("-", " ")}
                    </p>
                  </div>

                  {booking.symptoms && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">
                        Symptoms/Notes
                      </h4>
                      <p className="text-gray-600">{booking.symptoms}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Booking ID and Status */}
              <div className="border-t border-gray-200 pt-6 mt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">Booking ID</p>
                    <p className="font-mono text-gray-900">{booking.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Status</p>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Pending Confirmation
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-gray-50 px-8 py-6">
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/booking/history"
                  className="bg-white text-gray-700 border border-gray-300 px-6 py-3 rounded-md font-medium hover:bg-gray-50 text-center"
                >
                  View All Bookings
                </Link>
                <Link
                  href="/doctors"
                  className="bg-primary-600 text-white px-6 py-3 rounded-md font-medium hover:bg-primary-700 text-center"
                >
                  Book Another Appointment
                </Link>
              </div>
            </div>
          </div>

          {/* Important Information */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-medium text-blue-900 mb-2">
              Important Information
            </h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>
                • Please arrive 15 minutes before your scheduled appointment
                time
              </li>
              <li>• Bring a valid ID and any relevant medical documents</li>
              <li>• You will receive a confirmation call within 24 hours</li>
              <li>
                • To reschedule or cancel, please contact us at least 24 hours
                in advance
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookingConfirmationPage;
