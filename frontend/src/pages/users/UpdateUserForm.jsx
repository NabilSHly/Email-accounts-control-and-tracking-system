"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import axios from "axios"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from "@/components/ui/multi-select"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
const API_URL = import.meta.env.VITE_API_URL;

// Define permissions
const permissions = [
  { name: "ADMIN",description:"امكانية ادارة المستخدمين و الادرات والبلديات و أضافة عناوين بريد الكتروني" },
  { name: "REQUEST_ISSUE",description:"امكانية اضافة طلبات اصدار عنوان بريد الكتروني لموظف في البلدية" },
  // { name: "EDITOR" },
  { name: "VIEWER",description:"  يمكنه الأطلاع على عناوين البريد الكتروني لموظفي البلديات في الادرات المخول له الوصول اليها فقط " },
];


const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  username: z.string().min(1, "Username is required"),
  password: z.string().optional(),
  departmentsId: z.array(z.number()).min(1, "اختر قسمًا واحدًا على الأقل"),
  permissions: z.array(z.string()).min(1, "Please select at least one permission"),
})


export default function UpdateUserForm({ userId }) {
  const [isLoading, setIsLoading] = useState(true)
  const [departments, setDepartments] = useState([]);


  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      username: "",
      password: "",
      departmentsId: [],
      permissions: [],
    },
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user data
        const userResponse = await axios.get(`${API_URL}/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        })
        const userData = userResponse.data
console.log(userData);

        // Fetch departments
        const response = await axios.get(`${API_URL}/departments`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        setDepartments(response.data);
        

        // Reset form with user data
        form.reset({
          name: userData.name,
          username: userData.username,
          departmentsId: Array.isArray(userData.departmentsId?.set)
          ? userData.departmentsId.set
          : [],
          password: userData.password,
          permissions: userData.permissions || [], // Ensure permissions is an array
        })

        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching data", error)
        toast.error("Failed to load user data. Please try again.")
        setIsLoading(false)
      }
    }

    fetchData()
  }, [userId, form])

  const onSubmit = async (values) => {
    try {
      // Simulating API call to update user
      const response = await axios.put(`${API_URL}/users/${userId}`, values, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      })
      

      if (response.status === 200) {
        toast.success("تم تحديث المستخدم بنجاح")
      } else {
        throw new Error("Failed to update user")
      }
    } catch (error) {
      console.error("Form submission error", error)
      toast.error("Failed to update the user. Please try again.")
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 flex flex-col">
        <ScrollArea className=" pr-3">
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
                <FormLabel>كلمة المرور (اتركها  إذا لم ترغب في التغيير)</FormLabel>
                <FormControl>
                  <PasswordInput placeholder="كلمة المرور الجديدة" {...field} />
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

          <div className="text-xl font-bold text-center border-b mb-2">الصلاحيات</div>
          <div className="  ">
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

        <Button type="submit">تحديث المستخدم</Button>
      </form>
    </Form>
  )
}