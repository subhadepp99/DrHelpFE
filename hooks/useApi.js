import { useState, useEffect } from "react";
import { toast } from "react-toastify";

export const useApi = (apiFunction, dependencies = [], options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {
    onSuccess,
    onError,
    showErrorToast = true,
    initialData = null,
  } = options;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await apiFunction();
        setData(response.data);

        if (onSuccess) {
          onSuccess(response.data);
        }
      } catch (err) {
        setError(err);

        if (showErrorToast) {
          toast.error(err.response?.data?.message || "Something went wrong");
        }

        if (onError) {
          onError(err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, dependencies);

  const refetch = () => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await apiFunction();
        setData(response.data);

        if (onSuccess) {
          onSuccess(response.data);
        }
      } catch (err) {
        setError(err);

        if (showErrorToast) {
          toast.error(err.response?.data?.message || "Something went wrong");
        }

        if (onError) {
          onError(err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  };

  return { data, loading, error, refetch };
};
