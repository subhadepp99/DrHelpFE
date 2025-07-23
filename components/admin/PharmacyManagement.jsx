import React, { useState, useEffect } from "react";
import { pharmacyAPI } from "../../lib/api";
import { toast } from "react-toastify";
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiSearch,
  FiMapPin,
  FiClock,
} from "react-icons/fi";
import Modal from "../common/Modal";
import { useForm } from "react-hook-form";

const PharmacyManagement = () => {
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPharmacy, setEditingPharmacy] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();

  useEffect(() => {
    fetchPharmacies();
  }, [pagination.page, searchTerm]);

  const fetchPharmacies = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: searchTerm,
      };

      Object.keys(params).forEach((key) => {
        if (!params[key]) delete params[key];
      });

      const response = await pharmacyAPI.getAll(params);
      setPharmacies(response.data.pharmacies);
      setPagination((prev) => ({
        ...prev,
        total: response.data.total,
        totalPages: response.data.totalPages,
      }));
    } catch (error) {
      toast.error("Failed to fetch pharmacies");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async (data) => {
    try {
      // Process services as array
      const processedData = {
        ...data,
        services: data.services
          ? data.services.split(",").map((s) => s.trim())
          : [],
      };

      if (editingPharmacy) {
        await pharmacyAPI.update(editingPharmacy._id, processedData);
        toast.success("Pharmacy updated successfully");
      } else {
        await pharmacyAPI.create(processedData);
        toast.success("Pharmacy created successfully");
      }

      setModalOpen(false);
      setEditingPharmacy(null);
      reset();
      fetchPharmacies();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    }
  };

  const handleEdit = (pharmacy) => {
    setEditingPharmacy(pharmacy);

    // Populate form with pharmacy data
    Object.keys(pharmacy).forEach((key) => {
      if (key === "address" && pharmacy[key]) {
        Object.keys(pharmacy[key]).forEach((subKey) => {
          setValue(`address.${subKey}`, pharmacy[key][subKey]);
        });
      } else if (key === "services") {
        setValue(key, pharmacy[key].join(", "));
      } else if (key === "operatingHours") {
        Object.keys(pharmacy[key] || {}).forEach((day) => {
          setValue(
            `operatingHours.${day}.open`,
            pharmacy[key][day]?.open || ""
          );
          setValue(
            `operatingHours.${day}.close`,
            pharmacy[key][day]?.close || ""
          );
        });
      } else {
        setValue(key, pharmacy[key]);
      }
    });

    setModalOpen(true);
  };

  const handleDelete = async (pharmacyId) => {
    try {
      await pharmacyAPI.delete(pharmacyId);
      toast.success("Pharmacy deleted successfully");
      setDeleteConfirm(null);
      fetchPharmacies();
    } catch (error) {
      toast.error("Failed to delete pharmacy");
    }
  };

  const daysOfWeek = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1 max-w-lg">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search pharmacies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        <button
          onClick={() => {
            setEditingPharmacy(null);
            reset();
            setModalOpen(true);
          }}
          className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
        >
          <FiPlus className="h-4 w-4 mr-2" />
          Add Pharmacy
        </button>
      </div>

      {/* Pharmacies Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pharmacy
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  License
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Services
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                    </div>
                  </td>
                </tr>
              ) : pharmacies.length > 0 ? (
                pharmacies.map((pharmacy) => (
                  <tr key={pharmacy._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {pharmacy.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {pharmacy.email}
                        </div>
                        <div className="text-sm text-gray-500">
                          {pharmacy.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <FiMapPin className="h-4 w-4 mr-2 text-gray-400" />
                        <div>
                          <div>
                            {pharmacy.address?.city}, {pharmacy.address?.state}
                          </div>
                          <div className="text-gray-500">
                            {pharmacy.address?.zipCode}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {pharmacy.licenseNumber}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {pharmacy.services
                          ?.slice(0, 2)
                          .map((service, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                            >
                              {service}
                            </span>
                          ))}
                        {pharmacy.services?.length > 2 && (
                          <span className="text-xs text-gray-500">
                            +{pharmacy.services.length - 2} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          pharmacy.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {pharmacy.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(pharmacy)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <FiEdit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(pharmacy)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FiTrash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    No pharmacies found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() =>
                  setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
                }
                disabled={pagination.page === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() =>
                  setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
                }
                disabled={pagination.page === pagination.totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{" "}
                  <span className="font-medium">
                    {(pagination.page - 1) * pagination.limit + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(
                      pagination.page * pagination.limit,
                      pagination.total
                    )}
                  </span>{" "}
                  of <span className="font-medium">{pagination.total}</span>{" "}
                  results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  {[...Array(pagination.totalPages)].map((_, index) => (
                    <button
                      key={index}
                      onClick={() =>
                        setPagination((prev) => ({ ...prev, page: index + 1 }))
                      }
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        pagination.page === index + 1
                          ? "z-10 bg-primary-50 border-primary-500 text-primary-600"
                          : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Pharmacy Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingPharmacy(null);
          reset();
        }}
        title={editingPharmacy ? "Edit Pharmacy" : "Add New Pharmacy"}
        size="xl"
      >
        <form
          onSubmit={handleSubmit(handleCreateOrUpdate)}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pharmacy Name *
              </label>
              <input
                {...register("name", { required: "Name is required" })}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone *
              </label>
              <input
                {...register("phone", { required: "Phone is required" })}
                type="tel"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* License Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                License Number *
              </label>
              <input
                {...register("licenseNumber", {
                  required: "License number is required",
                })}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              {errors.licenseNumber && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.licenseNumber.message}
                </p>
              )}
            </div>
          </div>

          {/* Services */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Services
            </label>
            <input
              {...register("services")}
              type="text"
              placeholder="Enter services separated by commas"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <p className="mt-1 text-sm text-gray-500">
              Example: Prescription Medicines, OTC Medicines, Medical Equipment
            </p>
          </div>

          {/* Address */}
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-4">Address</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Street Address *
                </label>
                <input
                  {...register("address.street", {
                    required: "Street address is required",
                  })}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                {errors.address?.street && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.address.street.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City *
                </label>
                <input
                  {...register("address.city", {
                    required: "City is required",
                  })}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                {errors.address?.city && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.address.city.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State *
                </label>
                <input
                  {...register("address.state", {
                    required: "State is required",
                  })}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                {errors.address?.state && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.address.state.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Zip Code *
                </label>
                <input
                  {...register("address.zipCode", {
                    required: "Zip code is required",
                  })}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                {errors.address?.zipCode && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.address.zipCode.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Operating Hours */}
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-4">
              <FiClock className="inline h-5 w-5 mr-2" />
              Operating Hours
            </h4>
            <div className="space-y-3">
              {daysOfWeek.map((day) => (
                <div key={day} className="flex items-center space-x-4">
                  <div className="w-24">
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {day}
                    </span>
                  </div>
                  <div className="flex-1 grid grid-cols-2 gap-4">
                    <div>
                      <input
                        {...register(`operatingHours.${day}.open`)}
                        type="time"
                        placeholder="Opening time"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <input
                        {...register(`operatingHours.${day}.close`)}
                        type="time"
                        placeholder="Closing time"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => {
                setModalOpen(false);
                setEditingPharmacy(null);
                reset();
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700"
            >
              {editingPharmacy ? "Update Pharmacy" : "Create Pharmacy"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Delete Pharmacy"
        size="sm"
      >
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <FiTrash2 className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Delete {deleteConfirm?.name}?
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            This action cannot be undone. The pharmacy will be marked as
            inactive.
          </p>
          <div className="flex justify-center space-x-3">
            <button
              onClick={() => setDeleteConfirm(null)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() => handleDelete(deleteConfirm._id)}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PharmacyManagement;
