import {
  useState,
  useEffect
} from "react"
import {
  toast
} from "sonner"
import {
  useForm
} from "react-hook-form"
import {
  zodResolver
} from "@hookform/resolvers/zod"
import * as z from "zod"
import axios from "axios"

import {
  Button
} from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Input
} from "@/components/ui/input"
import {
  PasswordInput 
} from "@/components/ui/password-input"
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger
} from "@/components/ui/multi-select"
import {
  Checkbox
} from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@radix-ui/react-select"

const formSchema = z.object({
  name: z.string().min(1),
  username: z.string().min(1),
  password: z.string(),
  departments: z.array(z.string()).nonempty("Please at least one item"),
  admin: z.boolean().default(true).optional(),
  name_8366842101: z.boolean().default(true).optional(),
  name_2789172551: z.boolean().default(true).optional(),
  name_1667248405: z.boolean().default(true).optional(),
  name_6688626397: z.boolean().default(true).optional()
});


export default function CreateUserForm() {

  const form = useForm  ({
    resolver: zodResolver(formSchema),
   
  })

  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get('http://localhost:3000/departments', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        setDepartments(response.data);
      } catch (error) {
        console.error("Failed to fetch departments", error);
      }
    };

    fetchDepartments();
  }, []);

  function onSubmit(values ) {
    try {
      console.log(values);
      toast(
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(values, null, 2)}</code>
        </pre>
      );
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8  flex flex-col">
        <ScrollArea className="">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>الاسم</FormLabel>
              <FormControl>
                <Input 
                placeholder="أسم الموظف"
                dir="rtl"
                type="text"
                {...field} />
              </FormControl>
              <FormDescription></FormDescription>
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
                <Input 
                placeholder="اسم المستخدم"
                 dir="rtl"
                type=""
                {...field} />
              </FormControl>
              {/* <FormDescription>This is your public display name.</FormDescription> */}
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
                <PasswordInput  placeholder="password" {...field} />
              </FormControl>
              {/* <FormDescription> password.</FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        
        
           <FormField
              control={form.control}
              name="departments"
              render={({ field }) => (
                <FormItem  dir="rtl" className="p-4 ">
                  <FormLabel>:الأقسام التي يمكنه الأطلاع عليها</FormLabel>
                  <FormControl>
                    <MultiSelector
                      values={field.value || []}
                      onValuesChange={field.onChange}
                      loop
                    >
                      <MultiSelectorTrigger>
                        <MultiSelectorInput placeholder="اختر الاقسام" />
                      </MultiSelectorTrigger>
                      <MultiSelectorContent  >
                      <MultiSelectorList >
                        {departments.map(department => (
                          <MultiSelectorItem key={department.departmentId} value={department.department}>
                            {department.department}
                          </MultiSelectorItem>
                        ))}
                      </MultiSelectorList>
                      </MultiSelectorContent>
                    </MultiSelector>
                  </FormControl>
                  {/* <FormDescription>H</FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
        <div className="text-xl font-bold text-center border-b mb-2">الصلاحيات</div>
        <div  className="grid grid-cols-12 mb-2 gap-2 ">
          
          <div className="col-span-6 ">
            <FormField
          control={form.control}
          name="admin"
          render={({ field }) => (
            <FormItem className="space-x-3 flex space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>مدير النظام</FormLabel>
                <FormDescription>عنده كل الصلاحيات</FormDescription>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
          </div>
          
          <div className="col-span-6 ">
            <FormField
          control={form.control}
          name="name_8366842101"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>ارسال طلب اصدار  </FormLabel>
                <FormDescription>ارسال طلب اصدار عنوان بريد الكتروني </FormDescription>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
          </div>
          
        </div>
        
        <div className="grid grid-cols-12 gap-2">
          
          <div className="col-span-6">
            <FormField
          control={form.control}
          name="editor"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>التعديل</FormLabel>
                <FormDescription>امكانية التعديل علي بيانات موظفي البلديات و عنوين البريد</FormDescription>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
          </div>
          
          <div className="col-span-6">
            <FormField
          control={form.control}
          name="viewer"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>العرض</FormLabel>
                <FormDescription>استعراض العنوين و في الأقسام المخول بها</FormDescription>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
          </div>
          
          {/* <div className="col-span-4">
            <FormField
          control={form.control}
          name="usersManagement"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>أضافة مستخدمين</FormLabel>
                <FormDescription>يمكنهم اضافة مستخدمين في الأدرات المخول بها</FormDescription>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
          </div> */}
        </div>
        </ScrollArea>

        <Button type="submit">أضافة المستخدم</Button>
      </form>
    </Form>
  )
}