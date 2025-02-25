import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router";
import PrivateRoute from "@/components/PrivateRoute";
import Layout from "@/layout/Layout";
import Login from "@/pages/login/Login";
import {AuthProvider} from "@/context/AuthContext";
import './index.css'
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PrivateRoute>
        <Layout />
      </PrivateRoute>
    )
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "*",
    element: <h1>404: Page Not Found</h1>, // Or a custom 404 component
  }
]);

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  </AuthProvider>
)
