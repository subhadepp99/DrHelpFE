import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

const THEMES = {
  light: {
    name: "light",
    colors: {
      primary: "#3b82f6",
      secondary: "#10b981",
      background: "#ffffff",
      surface: "#f8fafc",
      text: {
        primary: "#1f2937",
        secondary: "#6b7280",
        muted: "#9ca3af",
      },
      border: "#e5e7eb",
      success: "#10b981",
      warning: "#f59e0b",
      error: "#ef4444",
      info: "#06b6d4",
    },
  },
  dark: {
    name: "dark",
    colors: {
      primary: "#60a5fa",
      secondary: "#34d399",
      background: "#111827",
      surface: "#1f2937",
      text: {
        primary: "#f9fafb",
        secondary: "#d1d5db",
        muted: "#9ca3af",
      },
      border: "#374151",
      success: "#34d399",
      warning: "#fbbf24",
      error: "#f87171",
      info: "#22d3ee",
    },
  },
  blue: {
    name: "blue",
    colors: {
      primary: "#2563eb",
      secondary: "#0891b2",
      background: "#ffffff",
      surface: "#f0f9ff",
      text: {
        primary: "#1e40af",
        secondary: "#3b82f6",
        muted: "#6b7280",
      },
      border: "#bfdbfe",
      success: "#059669",
      warning: "#d97706",
      error: "#dc2626",
      info: "#0284c7",
    },
  },
  green: {
    name: "green",
    colors: {
      primary: "#059669",
      secondary: "#0d9488",
      background: "#ffffff",
      surface: "#f0fdf4",
      text: {
        primary: "#064e3b",
        secondary: "#059669",
        muted: "#6b7280",
      },
      border: "#bbf7d0",
      success: "#10b981",
      warning: "#f59e0b",
      error: "#ef4444",
      info: "#06b6d4",
    },
  },
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState("light");
  const [systemTheme, setSystemTheme] = useState("light");

  // Detect system theme preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setSystemTheme(mediaQuery.matches ? "dark" : "light");

    const handleChange = (e) => {
      setSystemTheme(e.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Load theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("healthcare_theme");
    if (savedTheme && THEMES[savedTheme]) {
      setCurrentTheme(savedTheme);
    } else if (systemTheme) {
      setCurrentTheme(systemTheme);
    }
  }, [systemTheme]);

  // Apply theme to document
  useEffect(() => {
    const theme = THEMES[currentTheme];
    const root = document.documentElement;

    // Apply CSS custom properties
    Object.entries(theme.colors).forEach(([key, value]) => {
      if (typeof value === "object") {
        Object.entries(value).forEach(([subKey, subValue]) => {
          root.style.setProperty(`--color-${key}-${subKey}`, subValue);
        });
      } else {
        root.style.setProperty(`--color-${key}`, value);
      }
    });

    // Apply theme class to body
    document.body.className = document.body.className
      .replace(/theme-\w+/g, "")
      .concat(` theme-${currentTheme}`)
      .trim();

    // Save to localStorage
    localStorage.setItem("healthcare_theme", currentTheme);
  }, [currentTheme]);

  const setTheme = (themeName) => {
    if (THEMES[themeName]) {
      setCurrentTheme(themeName);
    }
  };

  const toggleTheme = () => {
    const themeNames = Object.keys(THEMES);
    const currentIndex = themeNames.indexOf(currentTheme);
    const nextIndex = (currentIndex + 1) % themeNames.length;
    setCurrentTheme(themeNames[nextIndex]);
  };

  const getThemeColor = (colorPath) => {
    const theme = THEMES[currentTheme];
    const path = colorPath.split(".");
    let color = theme.colors;

    for (const key of path) {
      color = color[key];
      if (!color) break;
    }

    return color;
  };

  const isDarkTheme = () => {
    return currentTheme === "dark";
  };

  const value = {
    currentTheme,
    theme: THEMES[currentTheme],
    availableThemes: Object.keys(THEMES),
    setTheme,
    toggleTheme,
    getThemeColor,
    isDarkTheme,
    systemTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export default ThemeContext;
