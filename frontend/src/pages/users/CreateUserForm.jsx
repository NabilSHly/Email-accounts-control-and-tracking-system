import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from "@/components/ui/multi-select";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@radix-ui/react-select";

const permissions = [
  { name: "ADMIN",description:"امكانية ادارة المستخدمين و الادرات والبلديات و أضافة عناوين بريد الكتروني" },
  { name: "REQUEST_ISSUE",description:"امكانية اضافة طلبات اصدار عنوان بريد الكتروني لموظف في البلدية" },
  // { name: "EDITOR" },
  { name: "VIEWER",description:"  يمكنه الأطلاع على عناوين البريد الكتروني لموظفي البلديات في الادرات المخول له الوصول اليها فقط " },
];

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  departmentsId: z.array(z.number()).nonempty("Please select at least one department"),
  permissions: z.array(z.string()).min(1, "Please select at least one permission"),
});
const API_URL = import.meta.env.VITE_API_URL;


export default function CreateUserForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      username: "",
      password: "",
      departmentsId: [],
      permissions: [],
    },
  });

  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get(`${API_URL}/departments`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        setDepartments(response.data);
      } catch (error) {
        console.error("Failed to fetch departments", error);
        toast.error("Failed to fetch departments. Please try again.");
      }
    };

    fetchDepartments();
  }, []);

  const onSubmit = async (values) => {
    try {
      console.log(values);
      await axios.post(`${API_URL}/users`, values, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      toast(
       "تم أضافة المستخدم بنجاح",
        {
          description: "يمكنك الأن الأطلاع على المستخدمين في صفحة المستخدمين",
          duration: 3000,
        }
      );
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 flex flex-col">
        <ScrollArea className="">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>الاسم</FormLabel>
                <FormControl>
                  <Input placeholder="أسم الموظف" dir="rtl" type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>اسم المستخدم</FormLabel>
                <FormControl>
                  <Input placeholder="اسم المستخدم" dir="rtl" type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>كلمة المرور</FormLabel>
                <FormControl>
                  <PasswordInput placeholder="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="departmentsId"
            render={({ field }) => (
              <FormItem dir="rtl" className="p-4">
                <FormLabel>:الأقسام التي يمكنه الأطلاع عليها</FormLabel>
                <FormControl>
                  <MultiSelector values={field.value || []} onValuesChange={field.onChange} loop>
                    <MultiSelectorTrigger>
                      <MultiSelectorInput placeholder="اختر الاقسام" />
                    </MultiSelectorTrigger>
                    <MultiSelectorContent>
                      <MultiSelectorList>
                        {departments.map((department) => (
                          <MultiSelectorItem key={department.departmentId} value={department.departmentId}>
                            {department.department}
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

          <div className="text-xl font-bold text-center w border-b mb-2">الصلاحيات</div>
          <div className="">
            <FormField
              control={form.control}
              name="permissions"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel>الصلاحيات</FormLabel>
                  <FormControl>
                    <div className="flex items-center justify-center">
                      {permissions.map((permission) => (
                        <div key={permission.name} className="flex  border p-2  items-center space-x-3">
                          <Checkbox
                            checked={field.value.includes(permission.name)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                field.onChange([...field.value, permission.name]);
                              } else {
                                field.onChange(field.value.filter((value) => value !== permission.name));
                              }
                            }}
                          />
                          <div className="flex flex-col">
                          <span className="font-bold">{permission.name}</span>
                          <span className="text-sm">{permission.description}</span>
                          </div>
                         
                        </div>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </ScrollArea>

        <Button type="submit">أضافة المستخدم</Button>
      </form>
    </Form>
  );
}