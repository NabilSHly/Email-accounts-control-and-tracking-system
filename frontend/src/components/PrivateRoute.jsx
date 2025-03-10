import { Navigate } from "react-router";
import { useContext, useEffect } from "react";
import AuthContext from "@/context/AuthContext";

const PrivateRoute = ({ children, requiredPermission }) => {
  const { userData, isAuthenticated, loading } = useContext(AuthContext);

  // Show loading state until authentication check is complete
  if (loading) {
    return <div>Loading...</div>; // You can customize this with a spinner or loading component
  }

  // If the user is not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // If the user does not have the required permission, redirect to unauthorized page
  if (requiredPermission && !userData?.permissions?.includes(requiredPermission)) {
    return <Navigate to="/unauthorized" />;
  }

  // Render the children if the user is authenticated and has the required permission
  return children;
};

export default PrivateRoute;
