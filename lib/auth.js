import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { STORAGE_KEYS } from "./constants";

// Token management
export const getToken = () => {
  return Cookies.get(STORAGE_KEYS.AUTH_TOKEN);
};

export const setToken = (token) => {
  // Set cookie with 7 days expiry
  Cookies.set(STORAGE_KEYS.AUTH_TOKEN, token, {
    expires: 7,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
};

export const removeToken = () => {
  Cookies.remove(STORAGE_KEYS.AUTH_TOKEN);
};

// User data management
export const getUser = () => {
  try {
    const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error("Error parsing user data:", error);
    return null;
  }
};

export const setUser = (userData) => {
  localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
};

export const removeUser = () => {
  localStorage.removeItem(STORAGE_KEYS.USER_DATA);
};

// Token validation
export const isTokenValid = (token = null) => {
  const authToken = token || getToken();

  if (!authToken) return false;

  try {
    const decodedToken = jwtDecode(authToken);
    const currentTime = Date.now() / 1000;

    // Check if token is expired
    if (decodedToken.exp < currentTime) {
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error validating token:", error);
    return false;
  }
};

// Get token payload
export const getTokenPayload = (token = null) => {
  const authToken = token || getToken();

  if (!authToken) return null;

  try {
    return jwtDecode(authToken);
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

// Check user roles
export const hasRole = (requiredRole) => {
  const user = getUser();
  if (!user || !user.role) return false;

  if (Array.isArray(requiredRole)) {
    return requiredRole.includes(user.role);
  }

  return user.role === requiredRole;
};

export const isAdmin = () => {
  return hasRole("admin");
};

export const isDoctor = () => {
  return hasRole("doctor");
};

export const isPatient = () => {
  return hasRole(["user", "patient"]);
};

// Authentication status
export const isAuthenticated = () => {
  const token = getToken();
  const user = getUser();

  return !!(token && user && isTokenValid(token));
};

// Logout functionality
export const logout = () => {
  removeToken();
  removeUser();

  // Clear other auth-related data
  localStorage.removeItem("healthcare_preferences");
  localStorage.removeItem("healthcare_cart");

  // Redirect to login page
  if (typeof window !== "undefined") {
    window.location.href = "/auth/login";
  }
};

// Auto-logout on token expiration
export const setupTokenExpirationCheck = () => {
  const checkTokenExpiration = () => {
    const token = getToken();

    if (token && !isTokenValid(token)) {
      console.log("Token expired, logging out...");
      logout();
    }
  };

  // Check token expiration every minute
  const intervalId = setInterval(checkTokenExpiration, 60000);

  // Initial check
  checkTokenExpiration();

  return () => clearInterval(intervalId);
};

// Refresh token functionality (if your backend supports it)
export const refreshToken = async () => {
  try {
    const currentToken = getToken();
    if (!currentToken) throw new Error("No token available");

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to refresh token");
    }

    const data = await response.json();

    if (data.token) {
      setToken(data.token);
      if (data.user) {
        setUser(data.user);
      }
      return data.token;
    }

    throw new Error("No token in refresh response");
  } catch (error) {
    console.error("Token refresh failed:", error);
    logout();
    throw error;
  }
};

// Password strength validation
export const validatePasswordStrength = (password) => {
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>?]/.test(password),
  };

  const passed = Object.values(checks).filter(Boolean).length;

  let strength = "weak";
  if (passed >= 4) strength = "strong";
  else if (passed >= 3) strength = "medium";

  return {
    strength,
    score: passed,
    maxScore: Object.keys(checks).length,
    checks,
    isValid: passed >= 3, // At least 3 criteria must be met
  };
};

// Email validation
export const validateEmail = (email) => {
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  return {
    isValid: emailRegex.test(email),
    message: emailRegex.test(email) ? "" : "Please enter a valid email address",
  };
};

// Phone validation (Indian format)
export const validatePhone = (phone) => {
  const phoneRegex = /^[6-9]\d{9}$/;
  const cleanPhone = phone.replace(/\D/g, "");

  return {
    isValid: phoneRegex.test(cleanPhone),
    message: phoneRegex.test(cleanPhone)
      ? ""
      : "Please enter a valid 10-digit mobile number",
  };
};

// Generate secure random password
export const generateSecurePassword = (length = 12) => {
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";

  const allChars = uppercase + lowercase + numbers + symbols;
  let password = "";

  // Ensure at least one character from each category
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];

  // Fill remaining length with random characters
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  // Shuffle the password
  return password
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");
};

// Session management
export const extendSession = () => {
  const token = getToken();
  const user = getUser();

  if (token && user) {
    // Refresh the cookie expiration
    setToken(token);
    setUser(user);
  }
};

// Auto-extend session on user activity
export const setupSessionExtension = () => {
  const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart"];
  let timeout;

  const resetTimer = () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      if (isAuthenticated()) {
        extendSession();
      }
    }, 15 * 60 * 1000); // 15 minutes
  };

  events.forEach((event) => {
    document.addEventListener(event, resetTimer, true);
  });

  // Initial timer setup
  resetTimer();

  return () => {
    events.forEach((event) => {
      document.removeEventListener(event, resetTimer, true);
    });
    clearTimeout(timeout);
  };
};

// Two-factor authentication helpers
export const generateBackupCodes = (count = 8) => {
  const codes = [];
  for (let i = 0; i < count; i++) {
    const code = Math.random().toString(36).substring(2, 10).toUpperCase();
    codes.push(code.match(/.{1,4}/g).join("-"));
  }
  return codes;
};

// Device fingerprinting (basic)
export const getDeviceFingerprint = () => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  ctx.textBaseline = "top";
  ctx.font = "14px Arial";
  ctx.fillText("Device fingerprint", 2, 2);

  return btoa(
    JSON.stringify({
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      screen: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      canvas: canvas.toDataURL(),
      timestamp: Date.now(),
    })
  );
};

export default {
  getToken,
  setToken,
  removeToken,
  getUser,
  setUser,
  removeUser,
  isTokenValid,
  getTokenPayload,
  hasRole,
  isAdmin,
  isDoctor,
  isPatient,
  isAuthenticated,
  logout,
  setupTokenExpirationCheck,
  refreshToken,
  validatePasswordStrength,
  validateEmail,
  validatePhone,
  generateSecurePassword,
  extendSession,
  setupSessionExtension,
  generateBackupCodes,
  getDeviceFingerprint,
};
