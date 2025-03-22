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
    message: "Department name must be at least 2 characters.",
  }),
})
export default function DepartmentForm({ onSubmit, onCancel, initialData = { name: "" } }) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  })

  const handleSubmit = async (data) => {
    try {
      await onSubmit(data);
      window.location.reload();
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
              <FormLabel>اسم القسم</FormLabel>
              <FormControl>        
                <Input placeholder="اسم القسم" {...field} aria-label="Department Name" />
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
