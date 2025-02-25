import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // Install using: npm install jwt-decode

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Function to validate and decode the token
  const validateToken = (token) => {
    try {
      const decoded = jwtDecode(token);
      if (decoded.exp * 1000 < Date.now()) {
        console.warn("Token expired, logging out.");
        logout();
        return null;
      }
      return decoded;
    } catch (error) {
      console.error("Invalid token:", error);
      return null;
    }
  };

  // Check local storage for existing auth state
  useEffect(() => {
    try {
      const token = localStorage.getItem("authToken");
      const user = localStorage.getItem("userData");

      if (token && user) {
        const decodedToken = validateToken(token);
        if (decodedToken) {
          setIsAuthenticated(true);
          setUserData(JSON.parse(user));
        } else {
          logout(); // If the token is invalid, log out the user
        }
      }
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      logout();
    }
  }, []);

  // Listen for auth changes in other tabs
  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem("authToken");
      if (!token || !validateToken(token)) {
        logout();
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Login function
  const login = (authToken, user) => {
    if (!validateToken(authToken)) return;
    localStorage.setItem("authToken", authToken);
    localStorage.setItem("userData", JSON.stringify(user));
    setUserData(user);
    setIsAuthenticated(true);
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    setUserData(null);
    setIsAuthenticated(false);
  };

  console.log({ userData, isAuthenticated });

  return (
    <AuthContext.Provider value={{ userData, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
