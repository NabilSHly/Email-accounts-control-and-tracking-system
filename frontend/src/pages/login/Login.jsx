import React, { useState, useContext } from "react";
import { useNavigate } from "react-router"; // Ensure correct import for React Router
import AuthContext from "../../context/AuthContext"; // Import context
import axios from "axios"; // Import Axios
import {Button} from "@/components/ui/button"; // Import Button component

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error message before new attempt
    setIsLoading(true);

    if (!username || !password) {
      setError("Please enter both username and password.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/auth/login",
        { username, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        console.log("Login successful:", response.data);
        
        login(response.data.token, response.data.user); // Call login from context to set token and user data
        navigate("/"); // Redirect to the home page after login
      } else {
        setError(response.data.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setError(
        error.response?.data?.message || "An error occurred. Please try again later."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main>
      <div
        dir="rtl"
        className="flex items-center justify-center min-h-screen bg-dots bg-dots-spacing bg-bg2"
      >
        <div className="w-full max-w-lg px-10 py-8 mx-auto bg-white border rounded-lg shadow-2xl">
          
          <form className="p-12 md:p-24" onSubmit={handleSubmit}>
            <div className="max-w-md mx-auto space-y-3">
              <h3 className="text-lg font-semibold">N&A</h3>
              <div>
                <label className="block py-1">اسم المستخدم</label>
                <input
                  id="username"
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="border w-full py-2 px-2 rounded shadow hover:border-indigo-600 ring-1 ring-inset ring-gray-300 font-mono"
                />
                <p className="text-sm mt-2 px-2 hidden text-gray-600">Text helper</p>
              </div>
              <div>
                <label className="block py-1">كلمة السر</label>
                <input
                  id="password"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border w-full py-2 px-2 rounded shadow hover:border-indigo-600 ring-1 ring-inset ring-gray-300 font-mono"
                />
              </div>
              <div className="flex gap-3 pt-3 items-center">
                <Button
                  type="submit"
                  className="border hover:border-primary-hover bg-primary hover:bg-primary-lite text-white px-4 py-2 rounded-lg shadow ring-1 ring-inset ring-gray-300"
                >
                  {isLoading ? "Loading..." : "دخول"}
                </Button>
                {error && <p style={{ color: "red" }}>{error}</p>}
              </div>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default Login;