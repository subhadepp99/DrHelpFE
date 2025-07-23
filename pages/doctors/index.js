import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import DoctorCard from "../../components/doctor/DoctorCard";
import SearchBar from "../../components/common/SearchBar";
import { doctorAPI } from "../../lib/api";
import { FiFilter, FiMapPin, FiStar, FiClock } from "react-icons/fi";

const DoctorsPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    specialization: "",
    experience: "",
    consultationFee: "",
    location: "",
    sortBy: "name",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });
  const [showFilters, setShowFilters] = useState(false);

  const router = useRouter();

  useEffect(() => {
    fetchDoctors();
  }, [pagination.page, filters]);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
      };

      // Remove empty filters
      Object.keys(params).forEach((key) => {
        if (!params[key]) delete params[key];
      });

      const response = await doctorAPI.getAll(params);
      setDoctors(response.data.doctors);
      setPagination((prev) => ({
        ...prev,
        total: response.data.total,
        totalPages: response.data.totalPages,
      }));
    } catch (error) {
      console.error("Error fetching doctors:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchParams) => {
    setFilters((prev) => ({
      ...prev,
      search: searchParams.query,
      location: searchParams.location || "",
    }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({ ...prev, [filterName]: value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({
      specialization: "",
      experience: "",
      consultationFee: "",
      location: "",
      sortBy: "name",
    });
  };

  const specializations = [
    "Cardiology",
    "Dermatology",
    "Endocrinology",
    "Gastroenterology",
    "Neurology",
    "Oncology",
    "Orthopedics",
    "Pediatrics",
    "Psychiatry",
    "Pulmonology",
    "Radiology",
    "Surgery",
    "Urology",
  ];

  return (
    <>
      <Head>
        <title>Find Doctors - HealthCare</title>
        <meta
          name="description"
          content="Find qualified doctors near you and book appointments"
        />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Find Doctors</h1>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <FiFilter className="h-4 w-4 mr-2" />
                Filters
              </button>
            </div>

            <SearchBar
              onSearch={handleSearch}
              placeholder="Search for doctors by name, specialization..."
            />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div
              className={`lg:w-64 ${showFilters ? "block" : "hidden lg:block"}`}
            >
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Filters</h3>
                  <button
                    onClick={clearFilters}
                    className="text-sm text-primary-600 hover:text-primary-700"
                  >
                    Clear All
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Specialization Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Specialization
                    </label>
                    <select
                      value={filters.specialization}
                      onChange={(e) =>
                        handleFilterChange("specialization", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">All Specializations</option>
                      {specializations.map((spec) => (
                        <option key={spec} value={spec}>
                          {spec}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Experience Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Experience
                    </label>
                    <select
                      value={filters.experience}
                      onChange={(e) =>
                        handleFilterChange("experience", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">Any Experience</option>
                      <option value="0-2">0-2 years</option>
                      <option value="3-5">3-5 years</option>
                      <option value="6-10">6-10 years</option>
                      <option value="10+">10+ years</option>
                    </select>
                  </div>

                  {/* Consultation Fee Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Consultation Fee
                    </label>
                    <select
                      value={filters.consultationFee}
                      onChange={(e) =>
                        handleFilterChange("consultationFee", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">Any Fee</option>
                      <option value="0-500">₹0 - ₹500</option>
                      <option value="500-1000">₹500 - ₹1000</option>
                      <option value="1000-2000">₹1000 - ₹2000</option>
                      <option value="2000+">₹2000+</option>
                    </select>
                  </div>

                  {/* Sort By */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sort By
                    </label>
                    <select
                      value={filters.sortBy}
                      onChange={(e) =>
                        handleFilterChange("sortBy", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="name">Name</option>
                      <option value="experience">Experience</option>
                      <option value="consultationFee">Consultation Fee</option>
                      <option value="rating">Rating</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {/* Results Header */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-gray-600">
                  {loading ? "Loading..." : `${pagination.total} doctors found`}
                </p>
              </div>

              {/* Loading State */}
              {loading && (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
              )}

              {/* Doctors Grid */}
              {!loading && doctors.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                  {doctors.map((doctor) => (
                    <DoctorCard key={doctor._id} doctor={doctor} />
                  ))}
                </div>
              )}

              {/* No Results */}
              {!loading && doctors.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-24 h-24 mx-auto mb-4 text-gray-400">
                    <FiMapPin className="w-full h-full" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No doctors found
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Try adjusting your search criteria or filters
                  </p>
                  <button
                    onClick={clearFilters}
                    className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700"
                  >
                    Clear Filters
                  </button>
                </div>
              )}

              {/* Pagination */}
              {!loading && pagination.totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2">
                  <button
                    onClick={() =>
                      setPagination((prev) => ({
                        ...prev,
                        page: prev.page - 1,
                      }))
                    }
                    disabled={pagination.page === 1}
                    className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>

                  {[...Array(pagination.totalPages)].map((_, index) => (
                    <button
                      key={index}
                      onClick={() =>
                        setPagination((prev) => ({ ...prev, page: index + 1 }))
                      }
                      className={`px-4 py-2 text-sm font-medium rounded-md ${
                        pagination.page === index + 1
                          ? "bg-primary-600 text-white"
                          : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}

                  <button
                    onClick={() =>
                      setPagination((prev) => ({
                        ...prev,
                        page: prev.page + 1,
                      }))
                    }
                    disabled={pagination.page === pagination.totalPages}
                    className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DoctorsPage;
