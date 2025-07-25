import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Table, TableHeader, TableBody, TableRow, TableCell } from '@/components/ui/table'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Edit, PlusCircle, Search, Trash } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CreateUserForm from './CreateUserForm';
import UpdateUserForm from './UpdateUserForm';
import { toast } from 'sonner';
const API_URL = import.meta.env.VITE_API_URL;

export default function MangeUsersPage() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [error, setError] = useState(""); // State for error messages
  const [isLoading, setIsLoading] = useState(false); // Loading state

  // Fetch users from the backend
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      console.log( token);
       // Get the token from local storage
      const response = await axios.get(`${API_URL}/users`, {
        headers: {
          Authorization: `Bearer ${token}`, // Set the Authorization header
        },
      });
      setUsers(response.data);
      
      
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch users");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(); // Fetch users when the component mounts
  }, []);

  return (
    <div className=' w-3/4 p-8 items-start  justify-center'>

          <div className=" mt-4   pt-4 p-1 border  bg-pIsabelline">
    <h1 className="text-2xl font-bold mb-5"> قائمة المستخدمين</h1>

          <div className="flex justify-between items-center mb-4">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="بحث"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 min-w-[300px] bg-white"
          />
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> اضافة مستخدم جديد  
            </Button>
          </DialogTrigger>
          <DialogContent className=" text-right max-w-[825px] ">
            <DialogHeader>
              <DialogTitle>اضافة مستخدم جديدة</DialogTitle>
              <DialogDescription>اضافة مستخدم جديدة.</DialogDescription>
            </DialogHeader>
          <CreateUserForm />
          </DialogContent>
        </Dialog>
      </div>
            {isLoading ? (
              <div>Loading...</div>
            ) : error ? (
              <div>Error: {error}</div>
            ) : (
              <Table className="bg-white">
                <TableHeader className="">
                  <TableRow>
                    <TableCell className="border font-bold text-lg  text-center">
                      الأسم
                    </TableCell>
                    
                    
                    <TableCell className="border font-bold text-lg  text-center">
                      أسم المستخدم
                    </TableCell>
                    <TableCell className="border font-bold text-lg text-center">
                      الصلاحيات
                    </TableCell>
                    <TableCell className="border font-bold text-lg text-center">
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {users.filter(user => user.name.includes(searchTerm)).map((user) => (
                    <TableRow  key={user.id}>
                      <TableCell className="border text-center">
                       {user.name}
                      </TableCell>

                      <TableCell className="border text-center">
                        {user.username}
                      </TableCell>

                      

                      <TableCell className="border font-bold text-center">
                        {user.permissions.join(", ")}
                      </TableCell>

                      <TableCell className="border flex gap-4 items-center justify-center ">
                       
                      <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            setEditingUser(user);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          className="bg-rose-500 text-white"
                          size="icon"
                          onClick={() => {
                            // Delete the user
                            axios.delete(`${API_URL}/users/${user.id}`, {
                              headers: {
                                Authorization: `Bearer ${localStorage.getItem(
                                  "authToken"
                                )}`,
                              },
                            })
                            
                              .then((response) => {
                                if (response.status === 200) {
                                  toast.success("تم حذف المستخدم بنجاح");
                                  fetchUsers(); // Refresh the users list
                                } else {
                                  toast.error("Failed to delete user");
                                }
                              })
                              .catch((error) => {
                                console.error("Error deleting user", error);
                                toast.error("Error deleting user");
                            })}}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className=" text-right max-w-[625px] ">
          <DialogHeader>
            <DialogTitle>عدل  </DialogTitle>
            <DialogDescription>تعديل بيانات المستخدم.</DialogDescription>
          </DialogHeader>
          {editingUser && (
            <UpdateUserForm
              userId={editingUser.id}
              onCancel={() => {
                setIsEditDialogOpen(false);
                setEditingUser(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
        </div>
    </div>
  );
}
