import React from 'react'
import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusCircle, Search, Edit, Trash2 } from "lucide-react";
import  DepartmentForm  from "./DepartmentForm";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [error, setError] = useState(""); // State for error messages
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const validateToken = () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("Authentication token is missing. Please log in.");
      return false;
    }
    const decoded = jwtDecode(token);
    if (decoded.exp * 1000 < Date.now()) {
      setError("Token expired. Please log in again.");
      return false;
    }
    return true;
  };
  useEffect(() => {
    if (!validateToken()) return;

    const fetchDepartments = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${API_URL}/departments`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });

        // Assuming response.data is an array of  objects
        setDepartments(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching departments:", error);
        setError("Failed to fetch departments.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDepartments();
  }, []);
  const filteredDepartments = departments.filter((department) => {
    // Ensure department.department is a string before calling toLowerCase
    return typeof department.department === 'string' && 
           department.department.toLowerCase().includes(searchTerm.toLowerCase());
  });
  
  const handleAddDepartment = async (values) => {
    
    // Validate that a name is provided.
    if (!values.name) {
      setError("Department name is required.");
      return;
    }
  
    // Retrieve the token from localStorage and validate it.
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("Authentication token is missing. Please log in.");
      return;
    }
  
    try {
      setIsLoading(true);
      setError(""); // Reset error state before making the request
  
      // Make a POST request to the backend endpoint.
      const response = await axios.post(
        `${API_URL}/departments`,
        { name: values.name },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      // Optionally, check for a successful status code (e.g., 201 Created)
      if (response.status === 201 || response.status === 200) {
        // Append the new department to your state.
        setDepartments([...departments, response.data]);
        setIsAddDialogOpen(false);
      } else {
        setError("Failed to add department. Please try again.");
      }
    } catch (error) {
      console.error("Error adding department:", error.response ? error.response.data : error);
      setError(error.response?.data?.error || "Failed to add department. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  const handleEditDepartment = async (values) => {
    // Validate that a new department name is provided.
    if (!values.name) {
      setError("department name is required.");
      return;
    }
  
    // Retrieve and validate the authentication token.
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("Authentication token is missing. Please log in.");
      return;
    }
  
    try {
      setIsLoading(true);
  
      // Make a PUT request to update the category.
      // Note: Although your form field is named "name", your backend maps this to the "category" field
      // in the database. Ensure that your backend controller handles this correctly.
      const response = await axios.put(
        `${API_URL}/departments/${editingDepartment.departmentId}`,
        { name: values.name },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      // Assuming your backend returns the updated department record with the field "category" as its name.
      setDepartments(
        departments.map((department) =>
            department.departmentId === editingDepartment.departmentId ? response.data : department
        )
      );
  
      // Close the edit dialog and clear the editing state.
      setIsEditDialogOpen(false);
      setEditingDepartment(null);
    } catch (error) {
      console.error(
        "Error editing department:",
        error.response ? error.response.data : error
      );
      setError(
        error.response?.data?.error ||
          "Failed to edit department. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };
  const handleDeleteDepartment= async (id) => {
    if (!window.confirm("هل أنت متأكد أنك تريد حذف هذا القسم؟")) return;
    try {
      await axios.delete(`${API_URL}/departments/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      setDepartments(departments.filter((department) => department.departmentId !== id));
    } catch (error) {
      console.error("Error deleting department:", error);
      setError("Failed to delete department. Please try again.");
    }
  };
  return (
    <div className="p-6 bg-pIsabelline w-3/4 mt-12  border rounde">
    <h1 className="text-2xl font-bold mb-5"> قائمة الاقسام</h1>
    {error && <p className="text-red-500 mb-4">{error}</p>} {/* Display error messages */}
    <div className="flex justify-between items-center mb-4">
      <div className="relative bg-white rounded-md">
        <Search className="absolute left-2 top-2.5  h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="بحث"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8 w-[300px]"
        />
      </div>
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogTrigger asChild>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />أضافة قسم جديد
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>اضافة قسم جديد </DialogTitle>
            <DialogDescription>    .</DialogDescription>
          </DialogHeader>
          <DepartmentForm
            onSubmit={handleAddDepartment}
            onCancel={() => setIsAddDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
    {isLoading ? (
      <div className="text-center">جاري تحميل البيانات...</div> /* Loading spinner/message */
    ) : (
      <Table className="bg-white">
        <TableHeader>
          <TableRow>
            <TableHead className="text-center text-black">اسم القسم</TableHead>
            <TableHead className="text-center text-black">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y border content-center">
          {filteredDepartments.length > 0 ? (
            filteredDepartments.map((department) => (
              <TableRow key={department.departmentId} className="border">
                <TableCell className="font-medium text-center">{department.department}</TableCell>
                <TableCell className="font-medium text-center">
                  <div className="flex gap-4 items-center justify-center">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        setEditingDepartment(department);
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="bg-rose-500 text-white"

                      onClick={() => handleDeleteDepartment(department.departmentId)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3} className="text-center">
                No departments found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    )}
    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>عدل الفئة</DialogTitle>
          <DialogDescription>تعديل اسم الفئة.</DialogDescription>
        </DialogHeader>
        {editingDepartment && (
          <DepartmentForm
            onSubmit={handleEditDepartment}
            onCancel={() => {
              setIsEditDialogOpen(false);
              setEditingDepartment(null);
            }}
            // Update initialData to use editingdepartment.department
            initialData={{ name: editingDepartment.department }}
          />
        )}
      </DialogContent>
    </Dialog>
  </div>
  )
}
