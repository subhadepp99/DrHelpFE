import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { doctorAPI } from "../../lib/api";
import {
  FiMapPin,
  FiPhone,
  FiMail,
  FiClock,
  FiDollarSign,
  FiStar,
  FiCalendar,
  FiAward,
} from "react-icons/fi";

const DoctorProfilePage = () => {
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      fetchDoctor();
    }
  }, [id]);

  const fetchDoctor = async () => {
    try {
      setLoading(true);
      const response = await doctorAPI.getById(id);
      setDoctor(response.data.doctor);
    } catch (error) {
      console.error("Error fetching doctor:", error);
      setError("Doctor not found");
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading doctor profile...</p>
        </div>
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Doctor Not Found
          </h1>
          <p className="text-gray-600 mb-4">
            The doctor you're looking for doesn't exist.
          </p>
          <Link
            href="/doctors"
            className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700"
          >
            Back to Doctors
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{doctor.name} - HealthCare</title>
        <meta
          name="description"
          content={`${doctor.name} - ${doctor.specialization} with ${doctor.experience} years of experience`}
        />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Doctor Image */}
              <div className="flex-shrink-0">
                <div className="relative w-48 h-48 rounded-lg overflow-hidden">
                  <Image
                    src={getImageUrl()}
                    alt={doctor.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 192px"
                  />
                </div>
              </div>

              {/* Doctor Info */}
              <div className="flex-1">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {doctor.name}
                    </h1>
                    <p className="text-xl text-primary-600 font-medium mb-2">
                      {doctor.specialization}
                    </p>
                    <div className="flex items-center text-yellow-500 mb-4">
                      <FiStar className="h-5 w-5 fill-current" />
                      <FiStar className="h-5 w-5 fill-current" />
                      <FiStar className="h-5 w-5 fill-current" />
                      <FiStar className="h-5 w-5 fill-current" />
                      <FiStar className="h-5 w-5 fill-current" />
                      <span className="ml-2 text-gray-600">
                        4.8 (245 reviews)
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link
                      href={`/booking/${doctor._id}`}
                      className="bg-primary-600 text-white px-6 py-3 rounded-md font-medium hover:bg-primary-700 text-center"
                    >
                      Book Appointment
                    </Link>
                    <button className="bg-white text-primary-600 border border-primary-600 px-6 py-3 rounded-md font-medium hover:bg-primary-50">
                      Send Message
                    </button>
                  </div>
                </div>

                {/* Quick Info Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <FiAward className="h-6 w-6 text-blue-600 mr-3" />
                      <div>
                        <p className="text-sm text-gray-600">Experience</p>
                        <p className="font-semibold text-gray-900">
                          {doctor.experience} Years
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <FiDollarSign className="h-6 w-6 text-green-600 mr-3" />
                      <div>
                        <p className="text-sm text-gray-600">
                          Consultation Fee
                        </p>
                        <p className="font-semibold text-gray-900">
                          ₹{doctor.consultationFee}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <FiClock className="h-6 w-6 text-purple-600 mr-3" />
                      <div>
                        <p className="text-sm text-gray-600">Next Available</p>
                        <p className="font-semibold text-gray-900">
                          Today 2:00 PM
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* About Section */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  About
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  Dr. {doctor.name} is an experienced{" "}
                  {doctor.specialization.toLowerCase()} with over{" "}
                  {doctor.experience} years of practice. They are dedicated to
                  providing comprehensive healthcare services and are known for
                  their patient-centered approach. With extensive training in{" "}
                  {doctor.qualification}, Dr. {doctor.name} stays updated with
                  the latest medical advances to ensure the best possible care
                  for their patients.
                </p>
              </div>

              {/* Qualifications */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Qualifications
                </h2>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <FiAward className="h-5 w-5 text-primary-600 mr-3 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900">
                        {doctor.qualification}
                      </p>
                      <p className="text-sm text-gray-600">Medical Degree</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <FiAward className="h-5 w-5 text-primary-600 mr-3 mt-1" />
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
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Services Offered
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-primary-600 rounded-full mr-3"></div>
                    <span className="text-gray-700">General Consultation</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-primary-600 rounded-full mr-3"></div>
                    <span className="text-gray-700">Follow-up Care</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-primary-600 rounded-full mr-3"></div>
                    <span className="text-gray-700">Preventive Care</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-primary-600 rounded-full mr-3"></div>
                    <span className="text-gray-700">Health Screening</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-primary-600 rounded-full mr-3"></div>
                    <span className="text-gray-700">Treatment Planning</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-primary-600 rounded-full mr-3"></div>
                    <span className="text-gray-700">
                      Emergency Consultation
                    </span>
                  </div>
                </div>
              </div>

              {/* Reviews */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Patient Reviews
                </h2>
                <div className="space-y-6">
                  {/* Sample Reviews */}
                  {[1, 2, 3].map((review) => (
                    <div
                      key={review}
                      className="border-b border-gray-100 last:border-b-0 pb-4 last:pb-0"
                    >
                      <div className="flex items-center mb-2">
                        <div className="flex items-center text-yellow-500">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <FiStar
                              key={star}
                              className="h-4 w-4 fill-current"
                            />
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-600">
                          • 2 days ago
                        </span>
                      </div>
                      <p className="text-gray-700 mb-2">
                        Excellent doctor! Very thorough examination and clear
                        explanation of the condition. Highly recommend for
                        anyone seeking quality healthcare.
                      </p>
                      <p className="text-sm text-gray-600">
                        - Anonymous Patient
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Contact Info */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Contact Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <FiPhone className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-gray-700">{doctor.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <FiMail className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-gray-700">{doctor.email}</span>
                  </div>
                  {doctor.address && (
                    <div className="flex items-start">
                      <FiMapPin className="h-5 w-5 text-gray-400 mr-3 mt-1" />
                      <div className="text-gray-700">
                        <p>{doctor.address.street}</p>
                        <p>
                          {doctor.address.city}, {doctor.address.state}{" "}
                          {doctor.address.zipCode}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Availability */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  <FiCalendar className="inline h-5 w-5 mr-2" />
                  Availability
                </h3>
                <div className="space-y-1">{getAvailabilityDisplay()}</div>
              </div>

              {/* Booking CTA */}
              <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-6 text-white">
                <h3 className="text-lg font-semibold mb-2">
                  Ready to book an appointment?
                </h3>
                <p className="text-primary-100 mb-4">
                  Book your consultation with Dr. {doctor.name} today and take
                  the first step towards better health.
                </p>
                <Link
                  href={`/booking/${doctor._id}`}
                  className="block bg-white text-primary-600 text-center py-3 px-6 rounded-md font-medium hover:bg-gray-50 transition-colors"
                >
                  Book Now - ₹{doctor.consultationFee}
                </Link>
              </div>

              {/* Quick Stats */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Quick Stats
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Patients Treated</span>
                    <span className="font-semibold text-gray-900">2,500+</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Years of Experience</span>
                    <span className="font-semibold text-gray-900">
                      {doctor.experience} Years
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Average Rating</span>
                    <span className="font-semibold text-gray-900">4.8/5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Response Time</span>
                    <span className="font-semibold text-gray-900">2 hours</span>
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

export default DoctorProfilePage;
