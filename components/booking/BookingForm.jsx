import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/router";
import DatePicker from "react-datepicker";
import { toast } from "react-toastify";
import { FiCalendar, FiClock, FiUser, FiPhone, FiMail } from "react-icons/fi";
import "react-datepicker/dist/react-datepicker.css";

const BookingForm = ({ doctor }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm();

  const appointmentType = watch("appointmentType", "consultation");

  useEffect(() => {
    if (user) {
      setValue("patientName", user.username || "");
      setValue("email", user.email || "");
    }
  }, [user, setValue]);

  useEffect(() => {
    if (selectedDate) {
      generateTimeSlots();
    }
  }, [selectedDate, doctor]);

  const generateTimeSlots = () => {
    if (!doctor.availability || !selectedDate) return;

    const dayName = selectedDate.toLocaleDateString("en-US", {
      weekday: "long",
    });
    const dayAvailability = doctor.availability.find(
      (slot) => slot.day === dayName
    );

    if (!dayAvailability) {
      setAvailableSlots([]);
      return;
    }

    const slots = [];
    const startTime = new Date(`2000-01-01 ${dayAvailability.startTime}`);
    const endTime = new Date(`2000-01-01 ${dayAvailability.endTime}`);
    const slotDuration = 30; // 30 minutes per slot

    let currentTime = new Date(startTime);

    while (currentTime < endTime) {
      const timeString = currentTime.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      slots.push({
        time: timeString,
        available: Math.random() > 0.3, // Simulate availability
      });

      currentTime.setMinutes(currentTime.getMinutes() + slotDuration);
    }

    setAvailableSlots(slots);
  };

  const isDateAvailable = (date) => {
    if (!doctor.availability) return false;

    const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
    return doctor.availability.some((slot) => slot.day === dayName);
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30); // Allow booking up to 30 days in advance
    return maxDate;
  };

  const onSubmit = async (data) => {
    if (!isAuthenticated) {
      router.push("/auth/login?redirect=" + encodeURIComponent(router.asPath));
      return;
    }

    if (!selectedDate || !selectedTimeSlot) {
      toast.error("Please select date and time slot");
      return;
    }

    setIsLoading(true);

    try {
      // Create booking object
      const bookingData = {
        doctorId: doctor._id,
        doctorName: doctor.name,
        patientName: data.patientName,
        email: data.email,
        phone: data.phone,
        appointmentDate: selectedDate.toISOString().split("T")[0],
        timeSlot: selectedTimeSlot,
        appointmentType: data.appointmentType,
        symptoms: data.symptoms || "",
        consultationFee: doctor.consultationFee,
        status: "pending",
      };

      // For now, we'll store in localStorage (in production, this should be sent to your backend)
      const existingBookings = JSON.parse(
        localStorage.getItem("bookings") || "[]"
      );
      const bookingId = Date.now().toString();

      const newBooking = {
        id: bookingId,
        ...bookingData,
        createdAt: new Date().toISOString(),
      };

      existingBookings.push(newBooking);
      localStorage.setItem("bookings", JSON.stringify(existingBookings));

      toast.success("Appointment booked successfully!");

      // Redirect to booking confirmation
      router.push(`/booking/confirmation?bookingId=${bookingId}`);
    } catch (error) {
      console.error("Booking error:", error);
      toast.error("Failed to book appointment. Please try again.");
    }

    setIsLoading(false);
  };

  if (!doctor) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Book Appointment
      </h2>

      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-gray-900">{doctor.name}</h3>
        <p className="text-blue-600">{doctor.specialization}</p>
        <p className="text-gray-600">
          Consultation Fee: ₹{doctor.consultationFee}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Patient Information */}
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-gray-900">
            Patient Information
          </h4>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <FiUser className="inline mr-2" />
              Patient Name
            </label>
            <input
              {...register("patientName", {
                required: "Patient name is required",
              })}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter patient name"
            />
            {errors.patientName && (
              <p className="mt-1 text-sm text-red-600">
                {errors.patientName.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <FiMail className="inline mr-2" />
              Email Address
            </label>
            <input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter email address"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <FiPhone className="inline mr-2" />
              Phone Number
            </label>
            <input
              {...register("phone", {
                required: "Phone number is required",
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Please enter a valid 10-digit phone number",
                },
              })}
              type="tel"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter phone number"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">
                {errors.phone.message}
              </p>
            )}
          </div>
        </div>

        {/* Appointment Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Appointment Type
          </label>
          <select
            {...register("appointmentType", {
              required: "Please select appointment type",
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="consultation">General Consultation</option>
            <option value="followup">Follow-up</option>
            <option value="emergency">Emergency</option>
            <option value="routine-checkup">Routine Check-up</option>
          </select>
          {errors.appointmentType && (
            <p className="mt-1 text-sm text-red-600">
              {errors.appointmentType.message}
            </p>
          )}
        </div>

        {/* Date Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <FiCalendar className="inline mr-2" />
            Select Date
          </label>
          <DatePicker
            selected={selectedDate}
            onChange={setSelectedDate}
            filterDate={isDateAvailable}
            minDate={getMinDate()}
            maxDate={getMaxDate()}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholderText="Select appointment date"
            dateFormat="MMMM d, yyyy"
          />
          {selectedDate && !isDateAvailable(selectedDate) && (
            <p className="mt-1 text-sm text-red-600">
              Doctor is not available on this date
            </p>
          )}
        </div>

        {/* Time Slot Selection */}
        {selectedDate && availableSlots.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <FiClock className="inline mr-2" />
              Available Time Slots
            </label>
            <div className="grid grid-cols-3 gap-2">
              {availableSlots.map((slot, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() =>
                    slot.available && setSelectedTimeSlot(slot.time)
                  }
                  disabled={!slot.available}
                  className={`p-3 text-sm rounded-md border transition-colors ${
                    selectedTimeSlot === slot.time
                      ? "bg-blue-600 text-white border-blue-600"
                      : slot.available
                      ? "bg-white text-gray-700 border-gray-300 hover:border-blue-500"
                      : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                  }`}
                >
                  {slot.time}
                  {!slot.available && (
                    <span className="block text-xs mt-1">Booked</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {selectedDate && availableSlots.length === 0 && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-yellow-800">
              No available slots for the selected date.
            </p>
          </div>
        )}

        {/* Symptoms/Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Symptoms/Notes (Optional)
          </label>
          <textarea
            {...register("symptoms")}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Describe your symptoms or any additional notes..."
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !selectedDate || !selectedTimeSlot}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading
            ? "Booking..."
            : `Book Appointment (₹${doctor.consultationFee})`}
        </button>
      </form>
    </div>
  );
};

export default BookingForm;
