import React from "react";
import Head from "next/head";
import Link from "next/link";
import SearchBar from "../components/common/SearchBar";
import { FiSearch, FiCalendar, FiShield, FiClock } from "react-icons/fi";

const HomePage = () => {
  const features = [
    {
      icon: FiSearch,
      title: "Find Doctors",
      description: "Search and connect with qualified doctors in your area",
    },
    {
      icon: FiCalendar,
      title: "Book Appointments",
      description:
        "Schedule appointments at your convenience with instant confirmation",
    },
    {
      icon: FiShield,
      title: "Secure & Safe",
      description:
        "Your health data is protected with enterprise-grade security",
    },
    {
      icon: FiClock,
      title: "24/7 Support",
      description:
        "Get help whenever you need it with our round-the-clock support",
    },
  ];

  const specialties = [
    "Cardiology",
    "Dermatology",
    "Neurology",
    "Orthopedics",
    "Pediatrics",
    "Psychiatry",
    "Radiology",
    "Surgery",
  ];

  return (
    <>
      <Head>
        <title>HealthCare - Find Doctors & Book Appointments</title>
        <meta
          name="description"
          content="Find qualified doctors, book appointments, and manage your healthcare needs online."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-white">
        {/* Navigation */}
        <nav className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link href="/" className="text-2xl font-bold text-primary-600">
                  DrHelp Healthcare
                </Link>
              </div>

              <div className="flex items-center space-x-4">
                <Link
                  href="/search"
                  className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Find Doctors
                </Link>
                <Link
                  href="/auth/login"
                  className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-primary-50 to-secondary-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Your Health,{" "}
                <span className="text-primary-600">Our Priority</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Find qualified doctors, book appointments instantly, and take
                control of your healthcare journey
              </p>

              {/* Search Bar */}
              <div className="max-w-4xl mx-auto mb-12">
                <SearchBar placeholder="Search for doctors, clinics, or specialties..." />
              </div>

              {/* Quick Specialties */}
              <div className="flex flex-wrap justify-center gap-2 mb-8">
                {specialties.map((specialty) => (
                  <Link
                    key={specialty}
                    href={`/search?query=${specialty}&type=doctors`}
                    className="bg-white text-gray-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-primary-600 hover:text-white transition-colors shadow-sm"
                  >
                    {specialty}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Why Choose HealthCare?
              </h2>
              <p className="text-xl text-gray-600">
                We make healthcare accessible, convenient, and reliable for
                everyone
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-primary-600 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Join thousands of patients who trust us with their healthcare
              needs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/register"
                className="bg-white text-primary-600 px-8 py-3 rounded-md font-semibold hover:bg-gray-50 transition-colors"
              >
                Get Started Today
              </Link>
              <Link
                href="/search"
                className="border border-white text-white px-8 py-3 rounded-md font-semibold hover:bg-white hover:text-primary-600 transition-colors"
              >
                Find a Doctor
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="col-span-1 md:col-span-2">
                <h3 className="text-2xl font-bold text-primary-400 mb-4">
                  HealthCare
                </h3>
                <p className="text-gray-300 mb-4">
                  Making healthcare accessible and convenient for everyone. Find
                  doctors, book appointments, and manage your health online.
                </p>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="/search"
                      className="text-gray-300 hover:text-white"
                    >
                      Find Doctors
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/auth/register"
                      className="text-gray-300 hover:text-white"
                    >
                      Sign Up
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/auth/login"
                      className="text-gray-300 hover:text-white"
                    >
                      Login
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-4">Support</h4>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-gray-300 hover:text-white">
                      Help Center
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-300 hover:text-white">
                      Contact Us
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-300 hover:text-white">
                      Privacy Policy
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2024 HealthCare. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default HomePage;
