import React, { useState } from "react";
import Calendar from "react-calendar";
import { FiClock, FiCalendar } from "react-icons/fi";
import "react-calendar/dist/Calendar.css";

const AvailabilityCalendar = ({ doctor, onDateSelect, onTimeSelect }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState([]);

  const isDateAvailable = (date) => {
    if (!doctor.availability) return false;

    const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
    return doctor.availability.some((slot) => slot.day === dayName);
  };

  const generateTimeSlots = (date) => {
    if (!doctor.availability) return [];

    const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
    const dayAvailability = doctor.availability.find(
      (slot) => slot.day === dayName
    );

    if (!dayAvailability) return [];

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

    return slots;
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    const slots = generateTimeSlots(date);
    setAvailableSlots(slots);

    if (onDateSelect) {
      onDateSelect(date);
    }
  };

  const handleTimeSlotClick = (timeSlot) => {
    if (!timeSlot.available) return;

    if (onTimeSelect) {
      onTimeSelect(timeSlot.time);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <FiCalendar className="h-5 w-5 mr-2" />
        Select Date & Time
      </h3>

      {/* Calendar */}
      <div className="mb-6">
        <Calendar
          onChange={handleDateChange}
          value={selectedDate}
          minDate={new Date()}
          maxDate={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)} // 30 days from now
          tileDisabled={({ date }) => !isDateAvailable(date)}
          className="w-full"
        />
      </div>

      {/* Time Slots */}
      {selectedDate && (
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-3 flex items-center">
            <FiClock className="h-4 w-4 mr-2" />
            Available Time Slots
          </h4>

          {isDateAvailable(selectedDate) ? (
            <div className="grid grid-cols-3 gap-2">
              {generateTimeSlots(selectedDate).map((slot, index) => (
                <button
                  key={index}
                  onClick={() => handleTimeSlotClick(slot)}
                  disabled={!slot.available}
                  className={`p-3 text-sm rounded-md border transition-colors ${
                    slot.available
                      ? "border-gray-300 text-gray-700 hover:border-primary-500 hover:bg-primary-50"
                      : "border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed"
                  }`}
                >
                  {slot.time}
                  {!slot.available && (
                    <span className="block text-xs mt-1">Booked</span>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">
              Doctor is not available on this date. Please select another date.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default AvailabilityCalendar;
