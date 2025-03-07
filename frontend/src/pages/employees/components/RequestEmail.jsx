import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from "@/components/ui/multi-select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { fetchMunicipalities, fetchDepartments } from "@/services/api";

// Form validation schema
const formSchema = z.object({
  engFirstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters." }),
  engFatherName: z
    .string()
    .min(2, { message: "Father's name must be at least 2 characters." }),
  engLastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters." }),
  arFirstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters." }),
  arMiddleName: z
    .string()
    .min(2, { message: "Middle name must be at least 2 characters." }),
  arLastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters." }),
  departments: z
    .array(z.number())
    .min(1, { message: "Select at least one department." }),
  municipalityId: z.number({ message: "Municipality is required." }),
  phoneNumber: z
    .string()
    .min(10, { message: "Phone number must be at least 10 digits." })
    .regex(/^[0-9]+$/, { message: "Phone number must contain only digits." }),
  notes: z.string().optional(),
});

export default function RequestEmail() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [municipalities, setMunicipalities] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Initialize form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      engFirstName: "",
      engFatherName: "",
      engLastName: "",
      arFirstName: "",
      arMiddleName: "",
      arLastName: "",
      departments: [], // Initialize as empty array
      municipalityId: undefined,
      phoneNumber: "",
      notes: "",
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [departmentsResponse, municipalitiesResponse] = await Promise.all([
          fetchDepartments(),
          fetchMunicipalities(),
        ]);
        // Ensure we're getting arrays
        setDepartments(Array.isArray(departmentsResponse) ? departmentsResponse : []);
        setMunicipalities(Array.isArray(municipalitiesResponse) ? municipalitiesResponse : []);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load data", {
          description:
            "Could not load departments and municipalities. Please try refreshing.",
        });
      }finally {
        setLoading(false);
      } 
    };

    fetchData();
  }, []);
  // console.log(deptResponse,deptResponse);

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
        console.log("Form data:", data);
        // const response = await axios.post(
        //   `${process.env.REACT_APP_API_URL}/employees/request`,
        //   {
        //     ...data,
        //     engname: `${data.engFirstName} ${data.engFatherName} ${data.engLastName}`,
        //     arname: `${data.arFirstName} ${data.arMiddleName} ${data.arLastName}`,
        //   }
        // );

      toast.success("تم تقديم الطلب", {
        description:
          "لقد تم تقديم طلب البريد الإلكتروني   بنجاح وهو في انتظار الموافقة.",
        duration: 5000,
      });

      // Clear form and redirect
      form.reset();
      setTimeout(() => {
        // navigate('/dashboard', {
        //   state: { message: 'Request submitted successfully' }
        // });
      }, 2000);
    } catch (error) {
      console.error("Error submitting request:", error);
      toast.error("Submission Failed", {
        description:
          error.response?.data?.message ||
          "An error occurred while submitting your request. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredMunicipalities = searchTerm
    ? municipalities.filter((muni) =>
        muni.municipality.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : municipalities;

  return (
    <div>
    {loading ? (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    ) : (
    <div className="max-w-3xl mx-auto p-4">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <CardTitle className="text-2xl">طلب بريد إلكتروني جديد</CardTitle>
          </div>
          <CardDescription>
            يرجى تعبئة النموذج التالي لطلب بريد إلكتروني رسمي. سيتم مراجعة طلبك
            والرد عليه في أقرب وقت ممكن.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                {/* English Name */}
                <div className="flex gap-6">
                  <FormField
                    control={form.control}
                    name="engFirstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>الاسم الاول بالانجليزي</FormLabel>
                        <FormControl>
                          <Input placeholder="First Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="engFatherName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>اسم الاب بالانجليزي</FormLabel>
                        <FormControl>
                          <Input placeholder="Father's Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="engLastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>اللقب بالانجليزي</FormLabel>
                        <FormControl>
                          <Input placeholder="Last Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Arabic Name */}
                <div className="flex gap-6">
                  <FormField
                    control={form.control}
                    name="arFirstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>الاسم الأول</FormLabel>
                        <FormControl>
                          <Input placeholder="الاسم الأول" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="arMiddleName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>اسم الأب</FormLabel>
                        <FormControl>
                          <Input placeholder="اسم الأب" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="arLastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>اللقب</FormLabel>
                        <FormControl>
                          <Input placeholder="اللقب" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Phone Number */}
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>رقم الهاتف</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="09xxxxxxxx"
                          type="tel"
                          pattern="[0-9]*"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        سيتم استخدام رقم الهاتف للتواصل معك
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Municipality */}
                <FormField
                  control={form.control}
                  name="municipalityId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>البلدية</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(Number(value))}
                        value={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر البلدية" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <div className="sticky top-0 p-2 bg-background">
                            <Input
                              placeholder="ابحث عن البلدية..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="mb-2"
                            />
                          </div>
                          {filteredMunicipalities.map((muni) => (
                            <SelectItem
                              key={muni.municipalityId}
                              value={muni.municipalityId.toString()}
                            >
                              {muni.municipality}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Departments */}
              <FormField
                control={form.control}
                name="departments"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>المكاتب/ الإدارات</FormLabel>
                    <FormDescription>
                      اختر الإدارات التي ينتمي إليها الموظف
                    </FormDescription>
                    <FormControl>
                      <MultiSelector
                        values={(field.value || []).map((id) => id.toString())} // Add fallback for null/undefined
                        onValuesChange={(values) =>
                          field.onChange(values.map((v) => Number(v)))
                        }
                        loop
                      >
                        <MultiSelectorTrigger>
                          <MultiSelectorInput placeholder="اختر الاقسام" />
                        </MultiSelectorTrigger>
                        <MultiSelectorContent>
                          <MultiSelectorList>
                            {departments.map((dept) => (
                              <MultiSelectorItem
                                key={dept.departmentId}
                                value={dept.departmentId.toString()}
                              >
                                {dept.department}
                              </MultiSelectorItem>
                            ))}
                          </MultiSelectorList>
                        </MultiSelectorContent>
                      </MultiSelector>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Notes */}
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes / ملاحظات</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="اي معلومات اضافية"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      أي معلومات إضافية ترغب في إضافتها لطلبك
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting || !form.formState.isValid}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    جاري إرسال الطلب...
                  </>
                ) : (
                  "تقديم الطلب"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <p className="text-sm text-muted-foreground">
            * سيتم مراجعة طلبك من قبل المسؤولين وإنشاء بريد إلكتروني في حال
            الموافقة عليه.
          </p>
        </CardFooter>
      </Card>
    </div>)}
  </div>
  );
}
