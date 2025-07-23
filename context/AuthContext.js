import React, { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { authAPI } from "../lib/api";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = Cookies.get("healthcare_token");
    const userData = localStorage.getItem("healthcare_user");

    if (token && userData) {
      setUser(JSON.parse(userData));
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      const { token, user: userData } = response.data;

      Cookies.set("healthcare_token", token, { expires: 7 });
      localStorage.setItem("healthcare_user", JSON.stringify(userData));

      setUser(userData);
      setIsAuthenticated(true);

      toast.success("Login successful!");
      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
      return { success: false, error: error.response?.data?.message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      toast.success(
        "Registration successful! Please check your email for verification."
      );
      return { success: true, userId: response.data.userId };
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
      return { success: false, error: error.response?.data?.message };
    }
  };

  const verifyEmail = async (verificationData) => {
    try {
      const response = await authAPI.verifyEmail(verificationData);
      const { token, user: userData } = response.data;

      Cookies.set("healthcare_token", token, { expires: 7 });
      localStorage.setItem("healthcare_user", JSON.stringify(userData));

      setUser(userData);
      setIsAuthenticated(true);

      toast.success("Email verified successfully!");
      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.message || "Email verification failed");
      return { success: false, error: error.response?.data?.message };
    }
  };

  const logout = () => {
    Cookies.remove("healthcare_token");
    localStorage.removeItem("healthcare_user");
    setUser(null);
    setIsAuthenticated(false);
    toast.success("Logged out successfully!");
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    verifyEmail,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
