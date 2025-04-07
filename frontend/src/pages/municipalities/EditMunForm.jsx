import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Municipality name must be at least 2 characters.",
  }),
});

export default function EditMunForm({ onSubmit, onCancel, name }) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: name,
    },
  });

  const handleSubmit = async (data) => {
    try {
      await onSubmit(data);
      window.location.reload();

    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>البلدية</FormLabel>
              <FormControl>
                <Input placeholder="اسم البلدية" {...field} aria-label="Municipality Name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex items-center gap-2">
          <Button type="submit">تحديث</Button>
          <Button type="button" onClick={onCancel}>الغاء</Button>
        </div>
      </form>
    </Form>
  );
}
