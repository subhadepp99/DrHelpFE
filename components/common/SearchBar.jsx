import React, { useState, useEffect, useRef } from "react";
import { FiSearch, FiMapPin, FiX } from "react-icons/fi";
import { searchAPI } from "../../lib/api";
import { useRouter } from "next/router";

const SearchBar = ({
  onSearch,
  placeholder = "Search for doctors, clinics, or pharmacies...",
}) => {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [suggestions, setSuggestions] = useState({});
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedType, setSelectedType] = useState("all");

  const searchRef = useRef();
  const router = useRouter();

  // Debounced search for suggestions
  useEffect(() => {
    if (query.length >= 2) {
      const timeoutId = setTimeout(() => {
        fetchSuggestions();
      }, 300);

      return () => clearTimeout(timeoutId);
    } else {
      setSuggestions({});
      setShowSuggestions(false);
    }
  }, [query]);

  const fetchSuggestions = async () => {
    try {
      setIsLoading(true);
      const response = await searchAPI.suggestions({ query });
      setSuggestions(response.data.suggestions);
      setShowSuggestions(true);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (searchQuery = query) => {
    if (!searchQuery.trim()) return;

    const searchParams = {
      query: searchQuery.trim(),
      location: location.trim(),
      type: selectedType === "all" ? undefined : selectedType,
    };

    if (onSearch) {
      onSearch(searchParams);
    } else {
      const queryString = new URLSearchParams(
        Object.entries(searchParams).filter(([_, value]) => value)
      ).toString();

      router.push(`/search?${queryString}`);
    }

    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion, type) => {
    let searchQuery = "";

    switch (type) {
      case "doctors":
        searchQuery = `${suggestion.name} ${suggestion.specialization}`;
        break;
      case "clinics":
        searchQuery = suggestion.name;
        break;
      case "pharmacies":
        searchQuery = suggestion.name;
        break;
      default:
        searchQuery = suggestion.name || suggestion;
    }

    setQuery(searchQuery);
    handleSearch(searchQuery);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }

    if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={searchRef} className="relative w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        {/* Search Type Tabs */}
        <div className="flex border-b border-gray-200">
          {[
            { key: "all", label: "All" },
            { key: "doctors", label: "Doctors" },
            { key: "clinics", label: "Clinics" },
            { key: "pharmacies", label: "Pharmacies" },
          ].map((type) => (
            <button
              key={type.key}
              onClick={() => setSelectedType(type.key)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                selectedType === type.key
                  ? "text-primary-600 border-primary-600"
                  : "text-gray-500 border-transparent hover:text-gray-700"
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="flex items-center">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full pl-10 pr-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0"
              placeholder={placeholder}
              autoComplete="off"
            />
            {query && (
              <button
                onClick={() => {
                  setQuery("");
                  setSuggestions({});
                  setShowSuggestions(false);
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <FiX className="h-5 w-5" />
              </button>
            )}
          </div>

          <div className="border-l border-gray-200 pl-4">
            <div className="flex items-center">
              <FiMapPin className="text-gray-400 h-5 w-5 mr-2" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-40 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0"
                placeholder="Location"
              />
            </div>
          </div>

          <button
            onClick={() => handleSearch()}
            disabled={!query.trim()}
            className="mx-4 bg-primary-600 text-white px-6 py-3 rounded-md font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Search
          </button>
        </div>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 border-t-0 rounded-b-lg shadow-lg z-50 max-h-80 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">Searching...</div>
          ) : (
            <>
              {Object.entries(suggestions).map(([type, items]) => {
                if (!items || items.length === 0) return null;

                return (
                  <div
                    key={type}
                    className="border-b border-gray-100 last:border-b-0"
                  >
                    <div className="px-4 py-2 bg-gray-50 text-xs font-medium text-gray-500 uppercase">
                      {type}
                    </div>
                    {items.map((item, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(item, type)}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b border-gray-100 last:border-b-0"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-gray-900">
                              {item.name}
                            </div>
                            {type === "doctors" && item.specialization && (
                              <div className="text-sm text-gray-500">
                                {item.specialization}
                              </div>
                            )}
                            {(type === "clinics" || type === "pharmacies") &&
                              item.specialties && (
                                <div className="text-sm text-gray-500">
                                  {item.specialties.slice(0, 2).join(", ")}
                                </div>
                              )}
                          </div>
                          <FiSearch className="h-4 w-4 text-gray-400" />
                        </div>
                      </button>
                    ))}
                  </div>
                );
              })}

              {Object.values(suggestions).every(
                (items) => !items || items.length === 0
              ) && (
                <div className="p-4 text-center text-gray-500">
                  No suggestions found
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
