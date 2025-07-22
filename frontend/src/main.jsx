import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router";
import PrivateRoute from "@/components/PrivateRoute";
import Layout from "@/layout/Layout";
import Login from "@/pages/login/Login";
import {AuthProvider} from "@/context/AuthContext";
import '@/index.css'
import MangeUsersPage from '@/pages/users/MangeUsersPage';
import DepartmentsPage from '@/pages/departments/DepartmentsPage';
import MunicipalitiesPage from '@/pages/municipalities/MunicipalitiesPage';
import EmployeesEmails from '@/pages/employees/EmployeesEmails';
import CreateEmploye from '@/pages/employees/components/RequestEmail';
import RequestEmail from '@/pages/employees/components/RequestEmail';
import CreateEmail from '@/pages/employees/components/CreateEmail';
import AuditLogs from '@/pages/admin/AuditLogs';
import Dashboard from '@/pages/Dashboard';
import BulkEmailsImport from '@/pages/bulkEmailsImport/BulkEmailsImportPage';
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
        element: <Dashboard />,
        

      },
      {
        path: "/users",
        
        element:
        <PrivateRoute requiredPermission="ADMIN">
        <MangeUsersPage />
        </PrivateRoute>,
      },
      {
        path: "/departments",
        element:
        <PrivateRoute requiredPermission="ADMIN">
        <DepartmentsPage />
        </PrivateRoute>,
      },
      {
        path: "/municipalities",
        element:
        <PrivateRoute requiredPermission="ADMIN">
        <MunicipalitiesPage />
        </PrivateRoute>,
      },
      {
        path: "/employees",
        element: <EmployeesEmails />,
      },
      {
        path: "/employees/bulkEmailsImport",
        element: <BulkEmailsImport />,
      },
      {
        path: "/employees/request",
        element:
        <PrivateRoute requiredPermission="REQUEST_ISSUE">
        <RequestEmail />
        </PrivateRoute>,
      },
      {
        path: "/employees/create",
        element: 
        <PrivateRoute requiredPermission="ADMIN">
        <CreateEmail />
        </PrivateRoute>,
      },
      {
        path: "/admin/audit-logs",
        element: 
        <PrivateRoute requiredPermission="ADMIN">
        <AuditLogs />
        </PrivateRoute>,
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
