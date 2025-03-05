import { useEffect } from "react";
import { useForm } from "react-hook-form";
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
import { Edit } from "lucide-react";

export function EmployeeEditForm({ employee, departments, municipalities, onSuccess }) {
  const form = useForm({
    defaultValues: {
      engname: "",
      arname: "",
      email: "",
      phoneNumber: "",
      departments: []  ,
      municipalityId: "",
      status: "ACTIVE",
      reported: false,
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
        ? employee.departments.set.map((dept) => dept)
        : [], // Ensure departments is an array of department IDs or an empty array
      municipalityId: employee.municipalityId ? String(employee.municipalityId) : "",
    });
  }
}, [employee, form.reset]);


  const onSubmit = async (data) => {
    try {
      console.log("Updating employee:", data);
      // await updateEmployee(employee.employeeId, data);
      onSuccess(data);
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
                      <FormLabel>{name === "engname" ? "الاسم بالإنجليزية" : "الاسم بالعربية"}</FormLabel>
                      <FormControl>
                        <Input disabled {...field} />
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
                  name={name}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{name === "email" ? "البريد الإلكتروني" : "رقم الهاتف"}</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر البلدية" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {municipalities?.map((municipality) => (
                          <SelectItem
                            key={municipality.municipalityId}
                            value={String(municipality.municipalityId || "")}
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
                        onValuesChange={(values) => field.onChange(values.map(Number))}
                        loop
                      >
                        <MultiSelectorTrigger>
                          <MultiSelectorInput placeholder="اختر الاقسام" />
                        </MultiSelectorTrigger>
                        <MultiSelectorContent>
                          <MultiSelectorList>
                            {departments?.map((dept) => (
                              <MultiSelectorItem
                                key={dept.departmentId}
                                value={String(dept.departmentId || "")}
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
              {/* <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الحالة</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر الحالة" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {statuses?.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
             
            </div>
            <div className="flex justify-end gap-4">
              <Button type="submit">حفظ التغييرات</Button>
              <Button variant="outline" type="button">إلغاء</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
