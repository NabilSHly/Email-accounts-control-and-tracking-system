import React from 'react'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import axios from "axios";
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Municipality name must be at least 2 characters.",
  }),
  id: z.string().optional(),
})
export default function AddMunForm({ onSubmit, onCancel, initialData = { name: "", id: "" }}) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  })

  const handleSubmit = async (data) => {
    console.log(data);
    
    
    try {
      await onSubmit(data);
    } catch (error) {
      console.error("Error submitting form:", error);
      // Optionally, you can set an error state here to display a message to the user
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8  flex flex-col">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>  
              <FormLabel>البلدية</FormLabel>
              <FormControl>        
                <Input placeholder="اسم البلدية" {...field} aria-label="Department Name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="id"
          render={({ field }) => (
            <FormItem>  
              <FormLabel>الرقم التنظيمي</FormLabel>
              <FormControl>        
                <Input type="number" placeholder="الرقم التنظيمي" {...field} aria-label="" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center gap-2">
          <Button type="submit">حفظ</Button>
          <Button type="button" onClick={onCancel}>الغاء</Button>
        </div>
      </form>
    </Form>
  )
}
