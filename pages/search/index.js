import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import SearchBar from "../../components/common/SearchBar";
import DoctorCard from "../../components/doctor/DoctorCard";
import { searchAPI } from "../../lib/api";
import { FiMapPin, FiSearch } from "react-icons/fi";

const SearchPage = () => {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("all");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
  });

  const router = useRouter();

  useEffect(() => {
    const { query, type, location } = router.query;
    if (query) {
      setSearchQuery(query);
      setSearchType(type || "all");
      handleSearch({
        query,
        type: type || "all",
        location: location || "",
      });
    }
  }, [router.query]);

  const handleSearch = async (searchParams) => {
    try {
      setLoading(true);
      const params = {
        ...searchParams,
        page: pagination.page,
        limit: pagination.limit,
      };

      const response = await searchAPI.global(params);
      setResults(response.data.results);
      setSearchQuery(searchParams.query);
      setSearchType(searchParams.type || "all");

      // Update URL without causing re-render
      const queryString = new URLSearchParams(
        Object.entries(params).filter(([_, value]) => value)
      ).toString();

      window.history.replaceState(null, "", `/search?${queryString}`);
    } catch (error) {
      console.error("Search error:", error);
      setResults({});
    } finally {
      setLoading(false);
    }
  };

  const getTotalResults = () => {
    return Object.values(results).reduce((total, category) => {
      return total + (category?.total || 0);
    }, 0);
  };

  const renderDoctorResults = () => {
    if (!results.doctors?.data?.length) return null;

    return (
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Doctors ({results.doctors.total})
          </h2>
          {results.doctors.total > results.doctors.data.length && (
            <button className="text-primary-600 hover:text-primary-700 font-medium">
              View All Doctors
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.doctors.data.map((doctor) => (
            <DoctorCard key={doctor._id} doctor={doctor} />
          ))}
        </div>
      </div>
    );
  };

  const renderClinicResults = () => {
    if (!results.clinics?.data?.length) return null;

    return (
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Clinics ({results.clinics.total})
          </h2>
          {results.clinics.total > results.clinics.data.length && (
            <button className="text-primary-600 hover:text-primary-700 font-medium">
              View All Clinics
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.clinics.data.map((clinic) => (
            <div key={clinic._id} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {clinic.name}
              </h3>
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex items-center">
                  <FiMapPin className="h-4 w-4 mr-2" />
                  <span>
                    {clinic.address?.city}, {clinic.address?.state}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-1 mb-4">
                {clinic.specialties?.slice(0, 3).map((specialty, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
              <button className="w-full bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700">
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderPharmacyResults = () => {
    if (!results.pharmacies?.data?.length) return null;

    return (
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Pharmacies ({results.pharmacies.total})
          </h2>
          {results.pharmacies.total > results.pharmacies.data.length && (
            <button className="text-primary-600 hover:text-primary-700 font-medium">
              View All Pharmacies
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.pharmacies.data.map((pharmacy) => (
            <div
              key={pharmacy._id}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {pharmacy.name}
              </h3>
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex items-center">
                  <FiMapPin className="h-4 w-4 mr-2" />
                  <span>
                    {pharmacy.address?.city}, {pharmacy.address?.state}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-1 mb-4">
                {pharmacy.services?.slice(0, 3).map((service, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                  >
                    {service}
                  </span>
                ))}
              </div>
              <button className="w-full bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700">
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      <Head>
        <title>
          {searchQuery ? `Search Results for "${searchQuery}"` : "Search"} -
          HealthCare
        </title>
        <meta
          name="description"
          content="Search for doctors, clinics, and pharmacies"
        />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {searchQuery ? `Search Results` : "Search Healthcare Services"}
            </h1>
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {searchQuery && (
            <div className="mb-8">
              <p className="text-gray-600">
                {loading ? (
                  "Searching..."
                ) : (
                  <>
                    {getTotalResults() === 0
                      ? `No results found for "${searchQuery}"`
                      : `Found ${getTotalResults()} result${
                          getTotalResults() !== 1 ? "s" : ""
                        } for "${searchQuery}"`}
                  </>
                )}
              </p>
            </div>
          )}

          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          )}

          {!loading && searchQuery && getTotalResults() === 0 && (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <div className="w-24 h-24 mx-auto mb-4 text-gray-400">
                <FiSearch className="w-full h-full" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No results found
              </h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search terms or try a different search
              </p>
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Suggestions:</p>
                <ul className="text-sm text-gray-500 space-y-1">
                  <li>• Check your spelling</li>
                  <li>• Use more general terms</li>
                  <li>• Try searching for a specific specialty</li>
                </ul>
              </div>
            </div>
          )}

          {!loading && searchQuery && getTotalResults() > 0 && (
            <div>
              {renderDoctorResults()}
              {renderClinicResults()}
              {renderPharmacyResults()}
            </div>
          )}

          {!searchQuery && !loading && (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 text-gray-400">
                <FiSearch className="w-full h-full" />
              </div>
              <h2 className="text-xl font-medium text-gray-900 mb-2">
                Search for Healthcare Services
              </h2>
              <p className="text-gray-600">
                Find doctors, clinics, and pharmacies near you
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SearchPage;
