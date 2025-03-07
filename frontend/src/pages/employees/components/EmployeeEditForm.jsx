import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from "@/components/ui/multi-select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Edit } from "lucide-react";
import { toast } from "sonner";
import { updateEmployee } from "@/services/api";

// Define TypeScript interfaces


// Define validation schema using zod
const formSchema = z.object({
  engname: z.string().min(1, "الاسم بالإنجليزية مطلوب"),
  arname: z.string().min(1, "الاسم بالعربية مطلوب"),
  email: z.string().email("بريد إلكتروني غير صالح"),
  phoneNumber: z.string().min(10, "رقم الهاتف يجب أن يكون 10 أرقام"),
  departments: z.array(z.number()).min(1, "اختر قسمًا واحدًا على الأقل"),
  municipalityId: z.string().min(1, "البلدية مطلوبة"),
  status: z.enum(["ACTIVE", "INACTIVE", "PENDING"]),
  reported: z.enum(["true", "false"]),
  notes: z.string().optional(),
});


export function EmployeeEditForm({
  employee,
  departments,
  municipalities,
  // onSuccess,
}) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      engname: "",
      arname: "",
      email: "",
      phoneNumber: "",
      departments: [],
      municipalityId: "",
      status: "ACTIVE",
      reported: "false",
      notes: "",
    },
  });

  useEffect(() => {
    if (employee) {
      form.reset({
        engname: employee.engname || "",
        arname: employee.arname || "",
        email: employee.email || "",
        phoneNumber: employee.phoneNumber || "",
        departments: Array.isArray(employee.departments?.set)
          ? employee.departments.set
          : [],
        municipalityId: employee.municipalityId
          ? String(employee.municipalityId)
          : "",
        status: employee.status,
        reported: employee.reported ? "true" : "false",
        notes: employee.notes || "",
      });
    }
  }, [employee, form]);

  const onSubmit = async (data) => {
    try {
      console.log("Updating employee:", data);
      await updateEmployee(employee.employeeId, data);
      toast.success("تم تحديث بيانات الموظف بنجاح");
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          تعديل
          <Edit className="h-4 w-4 mr-1" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>تعديل بيانات الموظف</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {["engname", "arname"].map((name) => (
                <FormField
                  key={name}
                  control={form.control}
                  name={name}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {name === "engname"
                          ? "الاسم بالإنجليزية"
                          : "الاسم بالعربية"}
                      </FormLabel>
                      <FormControl>
                        <Input autoComplete="off" disabled {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}

              {["email", "phoneNumber"].map((name) => (
                <FormField
                  key={name}
                  control={form.control}
                  name={name }
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {name === "email" ? "البريد الإلكتروني" : "رقم الهاتف"}
                      </FormLabel>
                      <FormControl>
                        <Input autoComplete="off" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}

              <FormField
                control={form.control}
                name="municipalityId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>البلدية</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر البلدية" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {municipalities?.map((municipality) => (
                          <SelectItem
                            key={municipality.municipalityId}
                            value={String(municipality.municipalityId)}
                          >
                            {municipality.municipality}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="departments"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>المكاتب/ الإدارات</FormLabel>
                    <FormControl>
                      <MultiSelector
                        values={field.value.map(String)}
                        onValuesChange={(values) =>
                          field.onChange(values.map(Number))
                        }
                        loop
                      >
                        <MultiSelectorTrigger>
                          <MultiSelectorInput  placeholder="اختر الاقسام" />
                        </MultiSelectorTrigger>
                        <MultiSelectorContent>
                          <MultiSelectorList>
                            {departments?.map((dept) => (
                              <MultiSelectorItem
                                key={dept.departmentId}
                                value={String(dept.departmentId)}
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

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="p-2 border rounded">
                    <FormLabel>الحالة</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-2 items-end"
                      >
                        {[
                          { value: "ACTIVE", label: "نشط", color: "text-green-600" },
                          { value: "INACTIVE", label: "غير نشط", color: "text-red-600" },
                          { value: "PENDING", label: "قيد الانتظار", color: "text-yellow-600" },
                        ].map((item) => (
                          <div key={item.value} className="flex items-center space-x-2">
                            <Label className={`font-bold ${item.color}`} htmlFor={item.value}>
                              {item.label}
                            </Label>
                            <RadioGroupItem value={item.value} id={item.value} />
                          </div>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="reported"
                render={({ field }) => (
                  <FormItem className="space-y-3 p-2 border rounded">
                    <FormLabel>تم الابلاغ</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-2 items-end"
                      >
                        {[
                          { value: "true", label: "نعم" },
                          { value: "false", label: "لا" },
                        ].map((item) => (
                          <div key={item.value} className="flex items-center space-x-2">
                            <Label htmlFor={item.value}>{item.label}</Label>
                            <RadioGroupItem value={item.value} id={item.value} />
                          </div>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-end gap-4">
              <Button type="submit">حفظ التغييرات</Button>
              <Button variant="outline" type="button">
                إلغاء
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}