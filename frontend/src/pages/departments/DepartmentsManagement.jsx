import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
const API_URL = import.meta.env.VITE_API_URL;

// Form validation schema
const departmentSchema = z.object({
  departmentId: z.number().optional(),
  department: z.string().min(2, { message: "Department name must be at least 2 characters." })
});

export default function DepartmentsManagement() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize forms
  const addForm = useForm({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      department: ""
    }
  });

  const editForm = useForm({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      departmentId: 0,
      department: ""
    }
  });

  // Fetch departments
  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/departments`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` }
      });
      setDepartments(response.data);
    } catch (error) {
      console.error('Error fetching departments:', error);
      toast.error("فشل تحميل الأقسام", {
        description: error.response?.data?.error || "An error occurred while fetching departments."
      });
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchDepartments();
  }, []);

  // Handle add department
  const handleAddDepartment = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post(`${API_URL}/departments`, data, {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` }
      });
      
      toast.success("تمت إضافة القسم", {
        description: "تمت إضافة القسم بنجاح."
      });
      
      // Add to local state
      setDepartments([...departments, response.data.department]);
      
      // Close dialog and reset form
      setIsAddDialogOpen(false);
      addForm.reset();
    } catch (error) {
      console.error('Error adding department:', error);
      toast.error("Failed to add department", {
        description: error.response?.data?.error || "An error occurred while adding the department."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle edit department
  const handleEditDepartment = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await axios.put(
        `${API_URL}/departments/${data.departmentId}`, 
        { department: data.department },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` }
        }
      );
      
      toast.success("تم تحديث القسم", {
        description: "تم تحديث القسم بنجاح."
      });
      
      // Update local state
      setDepartments(departments.map(dept => 
        dept.departmentId === data.departmentId ? response.data.department : dept
      ));
      
      // Close dialog and reset form
      setIsEditDialogOpen(false);
      editForm.reset();
    } catch (error) {
      console.error('Error updating department:', error);
      toast.error("Failed to update department", {
        description: error.response?.data?.error || "An error occurred while updating the department."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete department
  const handleDeleteDepartment = async () => {
    if (!departmentToDelete) return;
    
    setIsSubmitting(true);
    try {
      await axios.delete(`${API_URL}/departments/${departmentToDelete}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` }
      });
      
      toast.success("تم حذف القسم", {
        description: "تم حذف القسم بنجاح."
      });
      
      // Update local state
      setDepartments(departments.filter(dept => dept.departmentId !== departmentToDelete));
      
      // Close dialog
      setDeleteConfirmOpen(false);
    } catch (error) {
      console.error('Error deleting department:', error);
      toast.error("Failed to delete department", {
        description: error.response?.data?.error || "An error occurred while deleting the department."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Rest of the component code remains unchanged */}
    </div>
  );
} 