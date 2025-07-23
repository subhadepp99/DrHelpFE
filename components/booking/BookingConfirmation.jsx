import React from "react";
import {
  FiCheck,
  FiCalendar,
  FiClock,
  FiUser,
  FiCreditCard,
} from "react-icons/fi";

const BookingConfirmation = ({ booking, doctor }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FiCheck className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-green-800 mb-2">
          Booking Confirmed!
        </h1>
        <p className="text-green-700">
          Your appointment has been successfully booked. You will receive a
          confirmation email shortly.
        </p>
      </div>

      {/* Booking Details Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Appointment Details
          </h2>
        </div>

        <div className="p-6 space-y-6">
          {/* Doctor Info */}
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
              <FiUser className="h-8 w-8 text-primary-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {doctor.name}
              </h3>
              <p className="text-gray-600">{doctor.specialization}</p>
              <p className="text-sm text-gray-500">{doctor.qualification}</p>
            </div>
          </div>

          {/* Appointment Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FiCalendar className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-semibold text-gray-900">
                    {formatDate(booking.appointmentDate)}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FiClock className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Time</p>
                  <p className="font-semibold text-gray-900">
                    {booking.timeSlot}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <FiUser className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Patient</p>
                  <p className="font-semibold text-gray-900">
                    {booking.patientName}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <FiCreditCard className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Consultation Fee</p>
                  <p className="font-semibold text-gray-900">
                    ₹{booking.consultationFee}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          {booking.appointmentType && (
            <div className="border-t border-gray-200 pt-4">
              <p className="text-sm text-gray-500 mb-1">Appointment Type</p>
              <p className="font-medium text-gray-900 capitalize">
                {booking.appointmentType.replace("-", " ")}
              </p>
            </div>
          )}

          {booking.symptoms && (
            <div className="border-t border-gray-200 pt-4">
              <p className="text-sm text-gray-500 mb-1">Symptoms/Notes</p>
              <p className="text-gray-900">{booking.symptoms}</p>
            </div>
          )}

          {/* Booking Reference */}
          <div className="border-t border-gray-200 pt-4 bg-gray-50 -mx-6 px-6 py-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Booking Reference</p>
                <p className="font-mono text-sm text-gray-900">{booking.id}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Status</p>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  {booking.status || "Pending Confirmation"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Important Information */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-medium text-blue-900 mb-3">
          Important Information
        </h3>
        <ul className="text-sm text-blue-800 space-y-2">
          <li className="flex items-start">
            <span className="flex-shrink-0 w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3"></span>
            Please arrive 15 minutes before your scheduled appointment time
          </li>
          <li className="flex items-start">
            <span className="flex-shrink-0 w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3"></span>
            Bring a valid ID and any relevant medical documents
          </li>
          <li className="flex items-start">
            <span className="flex-shrink-0 w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3"></span>
            You will receive a confirmation call within 24 hours
          </li>
          <li className="flex items-start">
            <span className="flex-shrink-0 w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3"></span>
            To reschedule or cancel, please contact us at least 24 hours in
            advance
          </li>
        </ul>
      </div>
    </div>
  );
};

export default BookingConfirmation;
