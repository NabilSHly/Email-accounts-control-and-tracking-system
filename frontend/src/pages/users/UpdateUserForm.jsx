"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

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

const formSchema = z.object({
  name: z.string().min(1),
  username: z.string().min(1),
  password: z.string().optional(),
  departments: z.array(z.string()).nonempty("Please select at least one item"),
  isSuperAdmin: z.boolean().default(false),
  canSendEmailRequest: z.boolean().default(false),
  canEdit: z.boolean().default(false),
  canView: z.boolean().default(false),
  canAddUsers: z.boolean().default(false),
})

export default function UpdateUserForm({ userId }) {
  const [isLoading, setIsLoading] = useState(true)

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      username: "",
      password: "",
      departments: [],
      isSuperAdmin: false,
      canSendEmailRequest: false,
      canEdit: false,
      canView: false,
      canAddUsers: false,
    },
  })

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Simulating API call to fetch user data
        const response = await fetch(`/api/users/${userId}`)
        const userData = await response.json()

        form.reset({
          name: userData.name,
          username: userData.username,
          departments: userData.departments,
          isSuperAdmin: userData.isSuperAdmin,
          canSendEmailRequest: userData.canSendEmailRequest,
          canEdit: userData.canEdit,
          canView: userData.canView,
          canAddUsers: userData.canAddUsers,
        })

        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching user data", error)
        toast.error("Failed to load user data. Please try again.")
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [userId, form])

  async function onSubmit(values) {
    try {
      // Simulating API call to update user
      const response = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error("Failed to update user")
      }

      toast.success("User updated successfully")
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
        <ScrollArea className="h-[400px] w-full rounded-md border p-4">
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
                <FormLabel>كلمة المرور (اتركها فارغة إذا لم ترغب في التغيير)</FormLabel>
                <FormControl>
                  <PasswordInput placeholder="كلمة المرور الجديدة" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="departments"
            render={({ field }) => (
              <FormItem dir="rtl" className="p-4">
                <FormLabel>:الأقسام التي يمكنه الأطلاع عليها</FormLabel>
                <FormControl>
                  <MultiSelector values={field.value} onValuesChange={field.onChange} loop>
                    <MultiSelectorTrigger>
                      <MultiSelectorInput placeholder="اختر الاقسام" />
                    </MultiSelectorTrigger>
                    <MultiSelectorContent>
                      <MultiSelectorList>
                        <MultiSelectorItem value="React">React</MultiSelectorItem>
                        <MultiSelectorItem value="Vue">Vue</MultiSelectorItem>
                        <MultiSelectorItem value="Svelte">Svelte</MultiSelectorItem>
                      </MultiSelectorList>
                    </MultiSelectorContent>
                  </MultiSelector>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="text-xl font-bold text-center border-b mb-2">الصلاحيات</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="isSuperAdmin"
              render={({ field }) => (
                <FormItem className="flex items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>مشرف عام</FormLabel>
                    <FormDescription>لديه جميع الصلاحيات</FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="canSendEmailRequest"
              render={({ field }) => (
                <FormItem className="flex items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>ارسال طلب اصدار عنوان بريد الكتروني</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="canEdit"
              render={({ field }) => (
                <FormItem className="flex items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>التعديل</FormLabel>
                    <FormDescription>يمكنه تعديل البيانات</FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="canView"
              render={({ field }) => (
                <FormItem className="flex items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>العرض</FormLabel>
                    <FormDescription>يمكنه عرض البيانات</FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="canAddUsers"
              render={({ field }) => (
                <FormItem className="flex items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>أضافة مستخدمين</FormLabel>
                    <FormDescription>يمكنه إضافة مستخدمين جدد</FormDescription>
                  </div>
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

