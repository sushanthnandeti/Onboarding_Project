'use client'

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const firstStepSchema = z.object({
  aboutMe: z.string().min(1, "Please tell us about yourself"),
  dob: z.string().min(1, "Please select your date of birth"),
});

interface StepOneProps {
  onNext: (data: any) => void;
  formData: any;
}

const StepOne = ({ onNext, formData }: StepOneProps) => {
  const form = useForm({
    resolver: zodResolver(firstStepSchema),
    defaultValues: {
      aboutMe: formData?.aboutMe || "",
      dob: formData?.dob || "",
    },
  });

  const onSubmit = (values: any) => {
    onNext(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-8 p-8">
        <FormField
          control={form.control}
          name="aboutMe"
          render={({ field }) => (
            <FormItem>
              <FormLabel>About Me</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Tell us about yourself" className="resize-none" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dob"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date of Birth</FormLabel>
              <FormControl>
                <Input {...field} type="date" placeholder="Select your date of birth" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="mt-8">Next</Button>
      </form>
    </Form>
  );
};

export default StepOne;