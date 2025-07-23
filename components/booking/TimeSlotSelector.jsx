import React, { useState, useEffect } from "react";
import { FiClock, FiCheck } from "react-icons/fi";

const TimeSlotSelector = ({
  selectedDate,
  doctor,
  onTimeSelect,
  selectedTime,
}) => {
  const [availableSlots, setAvailableSlots] = useState([]);

  useEffect(() => {
    if (selectedDate && doctor) {
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
        price: doctor.consultationFee,
      });

      currentTime.setMinutes(currentTime.getMinutes() + slotDuration);
    }

    setAvailableSlots(slots);
  };

  const handleSlotClick = (slot) => {
    if (!slot.available) return;
    onTimeSelect(slot.time);
  };

  if (!selectedDate) {
    return (
      <div className="text-center py-8 text-gray-500">
        Please select a date first
      </div>
    );
  }

  if (availableSlots.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <FiClock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No slots available
        </h3>
        <p>Doctor is not available on this date. Please select another date.</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <FiClock className="h-5 w-5 mr-2" />
        Available Time Slots
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {availableSlots.map((slot, index) => (
          <button
            key={index}
            onClick={() => handleSlotClick(slot)}
            disabled={!slot.available}
            className={`relative p-4 text-sm rounded-lg border transition-all duration-200 ${
              selectedTime === slot.time
                ? "border-primary-500 bg-primary-50 text-primary-700"
                : slot.available
                ? "border-gray-300 text-gray-700 hover:border-primary-300 hover:bg-primary-25"
                : "border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed"
            }`}
          >
            <div className="flex flex-col items-center">
              <span className="font-medium">{slot.time}</span>
              {slot.available ? (
                <span className="text-xs text-gray-500 mt-1">
                  ₹{slot.price}
                </span>
              ) : (
                <span className="text-xs mt-1">Booked</span>
              )}
            </div>

            {selectedTime === slot.time && (
              <div className="absolute -top-1 -right-1 bg-primary-500 text-white rounded-full p-1">
                <FiCheck className="h-3 w-3" />
              </div>
            )}
          </button>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <FiClock className="h-5 w-5 text-blue-600 mt-0.5" />
          </div>
          <div className="ml-3">
            <h4 className="text-sm font-medium text-blue-900">
              Appointment Duration
            </h4>
            <p className="text-sm text-blue-700 mt-1">
              Each appointment slot is 30 minutes. Please arrive 10 minutes
              early.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeSlotSelector;
