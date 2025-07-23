import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FiMapPin,
  FiPhone,
  FiMail,
  FiClock,
  FiDollarSign,
  FiStar,
  FiCalendar,
  FiAward,
  FiUsers,
  FiCheckCircle,
  FiThumbsUp,
} from "react-icons/fi";
import { formatCurrency } from "../../lib/utils";
import Button from "../ui/Button";
import Card from "../ui/Card";

const DoctorProfile = ({ doctor }) => {
  const [activeTab, setActiveTab] = useState("about");

  if (!doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading doctor profile...</p>
        </div>
      </div>
    );
  }

  const getImageUrl = () => {
    if (doctor?.image) {
      return `${process.env.NEXT_PUBLIC_API_URL}/files/${doctor.image}`;
    }
    return "/images/default-doctor.png";
  };

  const getAvailabilityDisplay = () => {
    if (!doctor?.availability || doctor.availability.length === 0) {
      return "Availability not set";
    }

    return doctor.availability.map((slot) => (
      <div
        key={slot.day}
        className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
      >
        <span className="font-medium text-gray-900">{slot.day}</span>
        <span className="text-gray-600">
          {slot.startTime} - {slot.endTime}
        </span>
      </div>
    ));
  };

  const tabs = [
    { id: "about", label: "About", icon: FiUsers },
    { id: "availability", label: "Availability", icon: FiClock },
    { id: "reviews", label: "Reviews", icon: FiStar },
    { id: "location", label: "Location", icon: FiMapPin },
  ];

  const reviews = [
    {
      id: 1,
      patientName: "Sarah Johnson",
      rating: 5,
      date: "2024-01-15",
      comment:
        "Excellent doctor! Very thorough examination and clear explanation of the treatment plan. Highly recommend.",
      verified: true,
    },
    {
      id: 2,
      patientName: "Michael Chen",
      rating: 5,
      date: "2024-01-10",
      comment:
        "Dr. was very professional and caring. Took time to answer all my questions and concerns.",
      verified: true,
    },
    {
      id: 3,
      patientName: "Emily Davis",
      rating: 4,
      date: "2024-01-05",
      comment:
        "Good experience overall. The doctor was knowledgeable and the staff was helpful.",
      verified: true,
    },
  ];

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <FiStar
        key={index}
        className={`h-4 w-4 ${
          index < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "about":
        return (
          <div className="space-y-6">
            {/* About Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                About Dr. {doctor.name}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Dr. {doctor.name} is an experienced{" "}
                {doctor.specialization.toLowerCase()} with over{" "}
                {doctor.experience} years of practice. They are dedicated to
                providing comprehensive healthcare services and are known for
                their patient-centered approach. With extensive training in{" "}
                {doctor.qualification}, Dr. {doctor.name} stays updated with the
                latest medical advances to ensure the best possible care for
                their patients.
              </p>
            </div>

            {/* Qualifications */}
            <div>
              <h4 className="text-md font-semibold text-gray-900 mb-3">
                Education & Qualifications
              </h4>
              <div className="space-y-3">
                <div className="flex items-start">
                  <FiAward className="h-5 w-5 text-primary-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">
                      {doctor.qualification}
                    </p>
                    <p className="text-sm text-gray-600">Medical Degree</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <FiAward className="h-5 w-5 text-primary-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">
                      Board Certified in {doctor.specialization}
                    </p>
                    <p className="text-sm text-gray-600">
                      Specialization Certification
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-md font-semibold text-gray-900 mb-3">
                Services Offered
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  "General Consultation",
                  "Follow-up Care",
                  "Preventive Care",
                  "Health Screening",
                  "Treatment Planning",
                  "Emergency Consultation",
                ].map((service, index) => (
                  <div key={index} className="flex items-center">
                    <FiCheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{service}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div>
              <h4 className="text-md font-semibold text-gray-900 mb-3">
                Languages
              </h4>
              <div className="flex flex-wrap gap-2">
                {["English", "Hindi", "Regional Language"].map(
                  (language, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary-100 text-primary-800 text-sm rounded-full"
                    >
                      {language}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>
        );

      case "availability":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Weekly Schedule
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="space-y-1">{getAvailabilityDisplay()}</div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <FiClock className="h-5 w-5 text-blue-600 mt-0.5" />
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-blue-900">
                    Appointment Information
                  </h4>
                  <div className="text-sm text-blue-700 mt-1 space-y-1">
                    <p>• Each consultation is approximately 30 minutes</p>
                    <p>• Please arrive 15 minutes before your appointment</p>
                    <p>• Emergency consultations available 24/7</p>
                    <p>• Online consultations also available</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "reviews":
        return (
          <div className="space-y-6">
            {/* Rating Summary */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="flex items-center mb-2">
                    <span className="text-3xl font-bold text-gray-900 mr-2">
                      4.8
                    </span>
                    <div className="flex">{renderStars(5)}</div>
                  </div>
                  <p className="text-gray-600">
                    Based on {reviews.length} reviews
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center text-green-600 mb-1">
                    <FiThumbsUp className="h-4 w-4 mr-1" />
                    <span className="text-sm font-medium">96% recommend</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    out of {reviews.length} patients
                  </p>
                </div>
              </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900">
                Patient Reviews
              </h4>
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-sm font-medium text-primary-600">
                          {review.patientName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center">
                          <p className="font-medium text-gray-900 mr-2">
                            {review.patientName}
                          </p>
                          {review.verified && (
                            <FiCheckCircle
                              className="h-4 w-4 text-green-500"
                              title="Verified Patient"
                            />
                          )}
                        </div>
                        <div className="flex items-center">
                          <div className="flex mr-2">
                            {renderStars(review.rating)}
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(review.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case "location":
        return (
          <div className="space-y-6">
            {/* Contact Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Contact & Location
              </h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <FiMapPin className="h-5 w-5 text-gray-400 mr-3 mt-1 flex-shrink-0" />
                  <div className="text-gray-700">
                    {doctor.address ? (
                      <>
                        <p>{doctor.address.street}</p>
                        <p>
                          {doctor.address.city}, {doctor.address.state}{" "}
                          {doctor.address.zipCode}
                        </p>
                      </>
                    ) : (
                      <p>Address not available</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center">
                  <FiPhone className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">{doctor.phone}</span>
                </div>

                <div className="flex items-center">
                  <FiMail className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">{doctor.email}</span>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div>
              <h4 className="text-md font-semibold text-gray-900 mb-3">
                Location Map
              </h4>
              <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <FiMapPin className="h-12 w-12 mx-auto mb-2" />
                  <p>Interactive map would be displayed here</p>
                  <p className="text-sm">
                    Integration with Google Maps or similar service
                  </p>
                </div>
              </div>
            </div>

            {/* Directions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-900 mb-2">
                Getting There
              </h4>
              <div className="text-sm text-blue-700 space-y-1">
                <p>• Parking available on-site</p>
                <p>• Accessible by public transport</p>
                <p>• Wheelchair accessible</p>
                <p>• Near major landmarks and hospitals</p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Doctor Header */}
      <Card className="mb-8">
        <Card.Content className="p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Doctor Image and Basic Info */}
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="relative w-48 h-48 mx-auto sm:mx-0 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={getImageUrl()}
                  alt={doctor.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 192px"
                />
              </div>

              <div className="flex-1">
                <div className="text-center sm:text-left">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {doctor.name}
                  </h1>
                  <p className="text-xl text-primary-600 font-medium mb-2">
                    {doctor.specialization}
                  </p>
                  <p className="text-gray-600 mb-4">{doctor.qualification}</p>

                  {/* Rating */}
                  <div className="flex items-center justify-center sm:justify-start text-yellow-500 mb-4">
                    {renderStars(5)}
                    <span className="ml-2 text-gray-600 text-sm">
                      (4.8 • 245 reviews)
                    </span>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-4 max-w-md mx-auto sm:mx-0">
                    <div className="text-center sm:text-left">
                      <div className="text-2xl font-bold text-gray-900">
                        {doctor.experience}
                      </div>
                      <div className="text-sm text-gray-500">
                        Years Experience
                      </div>
                    </div>
                    <div className="text-center sm:text-left">
                      <div className="text-2xl font-bold text-gray-900">
                        2,500+
                      </div>
                      <div className="text-sm text-gray-500">
                        Patients Treated
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons and Pricing */}
            <div className="lg:w-80 flex-shrink-0">
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="text-center mb-4">
                  <div className="text-2xl font-bold text-gray-900">
                    {formatCurrency(doctor.consultationFee)}
                  </div>
                  <div className="text-sm text-gray-500">Consultation Fee</div>
                </div>

                <div className="space-y-3">
                  <Button
                    className="w-full"
                    onClick={() =>
                      (window.location.href = `/booking/${doctor._id}`)
                    }
                  >
                    <FiCalendar className="h-4 w-4 mr-2" />
                    Book Appointment
                  </Button>

                  <Button variant="secondary" className="w-full">
                    <FiPhone className="h-4 w-4 mr-2" />
                    Call Now
                  </Button>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 text-center text-sm text-gray-500">
                  <p>
                    Next available:{" "}
                    <span className="font-medium text-gray-900">
                      Today 2:00 PM
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card.Content>
      </Card>

      {/* Tabs Navigation */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === tab.id
                    ? "border-primary-500 text-primary-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <TabIcon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <Card>
        <Card.Content className="p-6">{renderTabContent()}</Card.Content>
      </Card>
    </div>
  );
};

export default DoctorProfile;
