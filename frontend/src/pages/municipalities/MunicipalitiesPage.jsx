import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlusCircle, Search, Edit, Trash2 } from "lucide-react";
import AddMunForm from "./AddMunForm"; // Ensure the AddMunForm is properly implemented
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import EditMunForm from "./EditMunForm"; // Import the new EditMunForm component
const API_URL = import.meta.env.VITE_API_URL;

export default function MunicipalitiesPage() {
  const [municipalities, setMunicipalities] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingMunicipality, setEditingMunicipality] = useState(null);
  const [error, setError] = useState(""); // State for error messages
  const [isLoading, setIsLoading] = useState(false);

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

    const fetchMunicipalities = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${API_URL}/municipalities`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });

        setMunicipalities(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching municipalities:", error);
        setError("Failed to fetch municipalities.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMunicipalities();
  }, []);


  const filteredMunicipalities = municipalities.filter((municipality) => {
    // Ensure department.department is a string before calling toLowerCase
    return typeof municipality.municipality === 'string' && 
    municipality.municipality.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleAddMunicipality = async (values) => {
    
    if (!values.name & values.id) {
      setError("Municipality name is required.");
      return;
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("Authentication token is missing. Please log in.");
      return;
    }

    try {
      setIsLoading(true);
      setError(""); // Reset error state before making the request

      const response = await axios.post(
        `${API_URL}/municipalities`,
        { municipality: values.name,
          municipalityId: values.id
          
         },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201 || response.status === 200) {
        setMunicipalities([...municipalities, response.data]);
        setIsAddDialogOpen(false);
      } else {
        setError("Failed to add Municipality. Please try again.");
      }
    } catch (error) {
      console.error("Error adding Municipality:", error.response ? error.response.data : error);
      setError(error.response?.data?.error || "Failed to add Municipality. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditMunicipality = async (values) => {
    if (!values.name) {
      setError("Municipality name is required.");
      return;
    }
console.log(values);

    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("Authentication token is missing. Please log in.");
      return;
    }

    try {
      setIsLoading(true);

      const response = await axios.put(
        `${API_URL}/municipalities/${editingMunicipality.municipalityId}`,
        { municipality: values.name,
         },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMunicipalities(
        municipalities.map((municipality) =>
          municipality.municipalityId === editingMunicipality.municipalityId ? response.data : municipality
        )
      );

      setIsEditDialogOpen(false);
      setEditingMunicipality(null);
    } catch (error) {
      console.error("Error editing Municipality:", error.response ? error.response.data : error);
      setError(error.response?.data?.error || "Failed to edit Municipality. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteMunicipality = async (id) => {
    if (!window.confirm("Are you sure you want to delete this municipality?")) return;

    try {
      console.log(id);
      
      await axios.delete(`${API_URL}/municipalities/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      setMunicipalities(municipalities.filter((municipality) => municipality.municipalityId !== id));
    } catch (error) {
      console.error("Error deleting Municipality:", error);
      setError("Failed to delete Municipality. Please try again.");
    }
  };

  return (
    <div className="p-6 bg-pIsabelline w-3/4 mt-12 border rounded">
      <h1 className="text-2xl font-bold mb-5">قائمة البلديات</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>} {/* Display error messages */}
      <div className="flex justify-between items-center mb-4">
        <div className="relative bg-white rounded-md">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
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
              <PlusCircle className="mr-2 h-4 w-4" /> إضافة بلدية جديدة
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>إضافة بلدية جديدة</DialogTitle>
              <DialogDescription>يرجى ملء التفاصيل أدناه</DialogDescription>
            </DialogHeader>
            <AddMunForm
              onSubmit={handleAddMunicipality}
              onCancel={() => setIsAddDialogOpen(false)}
              initialData={{ name: "", id: undefined }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="text-center">جاري تحميل البيانات...</div>
      ) : (
        <Table className="bg-white">
          <TableHeader>
            <TableRow>
            <TableHead className="text-center text-black">الرقم التنظيمي</TableHead>

              <TableHead className="text-center text-black">اسم البلدية</TableHead>
              <TableCell className=" font-bold  text-center">
                                    Actions
                                  </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y border content-center">
            {filteredMunicipalities.length > 0 ? (
              filteredMunicipalities.map((municipality) => (
                <TableRow key={municipality.municipalityId} className="border">
                  <TableCell className="font-medium text-center">{municipality.municipalityId}</TableCell>
                  <TableCell className="font-medium text-center">{municipality.municipality}</TableCell>
                  <TableCell className="font-medium text-center">
                    <div className="flex gap-4  justify-center">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setEditingMunicipality(municipality);
                          setIsEditDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        className="bg-rose-500 text-white"

                        size="icon"
                        onClick={() => handleDeleteMunicipality(municipality.municipalityId)}
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
                  No municipalities found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>تعديل البلدية</DialogTitle>
            <DialogDescription>تعديل اسم البلدية.</DialogDescription>
          </DialogHeader>
          {editingMunicipality && (
            <EditMunForm
              onSubmit={handleEditMunicipality}
              onCancel={() => {
                setIsEditDialogOpen(false);
                setEditingMunicipality(null);
              }}
              name={ editingMunicipality.municipality }
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
