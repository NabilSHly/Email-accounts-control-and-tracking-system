import { Navigate } from "react-router";
import { useContext, useEffect, useState } from "react";
import AuthContext from "@/context/AuthContext";
console.log(AuthContext);

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext) || { isAuthenticated: false };
  const [loading, setLoading] = useState(true); // Track loading state

  useEffect(() => {
    setLoading(false); // After initial check, stop loading
  }, [isAuthenticated]);

  if (loading) {
    return <div>Loading...</div>; // You can customize this with a spinner or loading component
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute;
