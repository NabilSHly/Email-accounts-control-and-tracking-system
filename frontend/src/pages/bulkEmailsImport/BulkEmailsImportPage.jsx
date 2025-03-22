import React, { useState, useEffect } from "react";
import { fetchDepartments } from "@/services/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Info } from "lucide-react";
import CsvUploader from "./components/csv-uploader";
import { Alert, AlertDescription } from "@/components/ui/alert";
import axios from "axios";

export default function BulkEmailsImport() {
  const [jsonData, setJsonData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Fetch departments on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const departmentsData = await fetchDepartments();

        if (!departmentsData || departmentsData.length === 0) {
          setError(
            "لم يتم العثور على أقسام. الرجاء التحقق من الاتصال بالخادم."
          );
          setLoading(false);
          return;
        }

        setDepartments(departmentsData);

        // Auto-select first department if available
        if (departmentsData.length > 0) {
          setSelectedDepartment(departmentsData[0].departmentId.toString());
        }
      } catch (error) {
        console.error("Error fetching departments:", error);
        setError("فشل في جلب الأقسام. الرجاء المحاولة مرة أخرى لاحقًا.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate form data
    if (jsonData.length === 0) {
      toast.error("لا يوجد بيانات للرفع");
      return;
    }

    if (!selectedDepartment) {
      toast.error("الرجاء اختيار القسم");
      return;
    }
    

    // Validate email format for all entries
    const invalidEmails = jsonData.filter(
      (user) => !user.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)
    );
    

    if (invalidEmails.length > 0) {
      toast.error(`يوجد ${invalidEmails.length} بريد إلكتروني غير صالح`);
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      // Add department ID to each emp record
      const dataWithDepartment = jsonData.map((emp) => ({
        ...emp,
        departmentId: selectedDepartment,
      }));

      // Here you would implement the API call to add users
      // await addUsersFromCSV(dataWithDepartment);
      axios.post("http://localhost:3000/employees/upsert", {
        employees: dataWithDepartment,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
console.log(dataWithDepartment);

      toast.success(`تم رفع ${dataWithDepartment.length} سجل بنجاح`);
      // Reset form after successful submission
      setJsonData([]);
    } catch (error) {
      console.error("Error uploading data:", error);
      setError("حدث خطأ أثناء رفع البيانات. الرجاء المحاولة مرة أخرى.");
      toast.error("حدث خطأ أثناء رفع البيانات");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClearData = () => {
    if (jsonData.length > 0) {
      setJsonData([]);
      toast.info("تم مسح البيانات");
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">
          استيراد البريد الإلكتروني بالجملة
        </CardTitle>
        <CardDescription>
          قم برفع ملف CSV يحتوي على بيانات البريد الإلكتروني لموظفي اليلديات
          لإضافتهم إلى النظام
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="mr-2">جاري تحميل البيانات...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="department">القسم</Label>
              <Select
                value={selectedDepartment}
                onValueChange={setSelectedDepartment}
                required
              >
                <SelectTrigger id="department" className="w-full">
                  <SelectValue placeholder="اختر القسم" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((department) => (
                    <SelectItem
                      key={department.departmentId.toString()}
                      value={department.departmentId.toString()}
                    >
                      {department.department}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="bg-muted/40 p-4 rounded-md flex items-start gap-2 text-sm">
              <Info className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <p>
                يجب أن يحتوي ملف CSV على الأعمدة التالية: الاسم بالإنجليزية،
                الاسم بالعربية، البريد الإلكتروني، كلمة المرور، رقم الهاتف، رقم
                البلدية.
              </p>
            </div>

            <CsvUploader setJsonData={setJsonData} />

            <div className="flex justify-between items-center">
              <Button
                type="button"
                variant="outline"
                onClick={handleClearData}
                disabled={submitting || jsonData.length === 0}
              >
                مسح البيانات
              </Button>

              <Button
                type="submit"
                disabled={submitting || jsonData.length === 0}
                className="min-w-[120px]"
              >
                {submitting ? (
                  <>
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    جاري الرفع...
                  </>
                ) : (
                  `رفع البيانات (${jsonData.length})`
                )}
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
