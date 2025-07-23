import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FiStar, FiMapPin, FiClock, FiDollarSign } from "react-icons/fi";

const DoctorCard = ({ doctor }) => {
  const {
    _id,
    name,
    specialization,
    experience,
    consultationFee,
    image,
    address,
    availability,
  } = doctor;

  const getImageUrl = () => {
    if (image) {
      return `${process.env.NEXT_PUBLIC_API_URL}/files/${image}`;
    }
    return "/images/default-doctor.png";
  };

  const getAvailabilityText = () => {
    if (availability && availability.length > 0) {
      const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
      const todayAvailability = availability.find((slot) => slot.day === today);

      if (todayAvailability) {
        return `Available today: ${todayAvailability.startTime} - ${todayAvailability.endTime}`;
      }

      return `Next available: ${availability[0].day}`;
    }

    return "Availability not set";
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="relative h-48 w-full">
        <Image
          src={getImageUrl()}
          alt={name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {name}
          </h3>
          <div className="flex items-center text-yellow-500">
            <FiStar className="h-4 w-4 fill-current" />
            <span className="ml-1 text-sm text-gray-600">4.8</span>
          </div>
        </div>

        <p className="text-primary-600 font-medium text-sm mb-2">
          {specialization}
        </p>

        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center">
            <FiClock className="h-4 w-4 mr-2" />
            <span>{experience} years experience</span>
          </div>

          {address && (
            <div className="flex items-center">
              <FiMapPin className="h-4 w-4 mr-2" />
              <span className="truncate">
                {address.city}, {address.state}
              </span>
            </div>
          )}

          <div className="flex items-center">
            <FiDollarSign className="h-4 w-4 mr-2" />
            <span>₹{consultationFee} consultation fee</span>
          </div>
        </div>

        <div className="mt-4 text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
          {getAvailabilityText()}
        </div>

        <div className="mt-4 flex space-x-2">
          <Link
            href={`/doctors/${_id}`}
            className="flex-1 bg-white border border-primary-600 text-primary-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-500 text-center"
          >
            View Profile
          </Link>

          <Link
            href={`/booking/${_id}`}
            className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 text-center"
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;
