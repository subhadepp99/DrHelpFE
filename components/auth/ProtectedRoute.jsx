import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "../common/LoadingSpinner";

const ProtectedRoute = ({
  children,
  requireAuth = true,
  requireAdmin = false,
  redirectTo = "/auth/login",
}) => {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return; // Still loading auth state

    if (requireAuth && !isAuthenticated) {
      // Redirect to login with return URL
      const returnUrl = encodeURIComponent(router.asPath);
      router.push(`${redirectTo}?redirect=${returnUrl}`);
      return;
    }

    if (requireAdmin && (!user || user.role !== "admin")) {
      // Redirect to home if not admin
      router.push("/");
      return;
    }
  }, [
    user,
    isAuthenticated,
    loading,
    router,
    requireAuth,
    requireAdmin,
    redirectTo,
  ]);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show loading spinner while redirecting
  if (requireAuth && !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // Show loading spinner while checking admin access
  if (requireAdmin && (!user || user.role !== "admin")) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Checking permissions...</p>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
