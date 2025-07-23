import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import BookingForm from "../../components/booking/BookingForm";
import { doctorAPI } from "../../lib/api";
import { FiArrowLeft } from "react-icons/fi";

const BookingPage = () => {
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { doctorId } = router.query;

  useEffect(() => {
    if (doctorId) {
      fetchDoctor();
    }
  }, [doctorId]);

  const fetchDoctor = async () => {
    try {
      setLoading(true);
      const response = await doctorAPI.getById(doctorId);
      setDoctor(response.data.doctor);
    } catch (error) {
      console.error("Error fetching doctor:", error);
      setError("Doctor not found");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading booking information...</p>
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
            The doctor you're trying to book with doesn't exist.
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
        <title>Book Appointment with {doctor.name} - HealthCare</title>
        <meta
          name="description"
          content={`Book an appointment with ${doctor.name} - ${doctor.specialization}`}
        />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center py-4">
              <Link
                href={`/doctors/${doctorId}`}
                className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
              >
                <FiArrowLeft className="h-5 w-5 mr-2" />
                Back to Profile
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">
                Book Appointment
              </h1>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <BookingForm doctor={doctor} />
        </div>
      </div>
    </>
  );
};

export default BookingPage;
