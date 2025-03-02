import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router";
import PrivateRoute from "@/components/PrivateRoute";
import Layout from "@/layout/Layout";
import Login from "@/pages/login/Login";
import {AuthProvider} from "@/context/AuthContext";
import './index.css'
import MangeUsersPage from './pages/users/MangeUsersPage';
import DepartmentsPage from './pages/departments/DepartmentsPage';
import MunicipalitiesPage from './pages/municipalities/MunicipalitiesPage';
import EmployeesEmails from './pages/employees/employeesEmails';
import CreateEmploye from './pages/employees/components/RequestEmail';
import RequestEmail from './pages/employees/components/RequestEmail';
import CreateEmail from './pages/employees/components/CreateEmail';
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PrivateRoute>
        <Layout />
      </PrivateRoute>
    ),
    children: [
      {
        path: "/",
        element: <h1>Home</h1>,
      },
      {
        path: "/users",
        element: <MangeUsersPage />,
      },
      {
        path: "/departments",
        element: <DepartmentsPage />,
      },
      {
        path: "/municipalities",
        element: <MunicipalitiesPage />,
      },
      {
        path: "/employees",
        element: <EmployeesEmails />,
      },
      {
        path: "/employees/request",
        element: <RequestEmail />,
      },
      {
        path: "/employees/create",
        element: <CreateEmail />,
      }
    ],
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
