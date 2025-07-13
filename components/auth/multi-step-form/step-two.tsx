'use client'

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const secondStepSchema = z.object({
  skillLevel: z.string().min(1, "Please select your skill level"),
  location: z.string().min(1, "Please enter your location"),
  zipcode: z.string().min(1, "Please enter your zipcode"),
  city: z.string().min(1, "Please enter your city"),
  state: z.string().min(1, "Please enter your state"),
});

interface StepTwoProps {
  onNext: (data: any) => void;
  onBack: () => void;
  formData: any;
}

const StepTwo = ({ onNext, onBack, formData }: StepTwoProps) => {
  const form = useForm({
    resolver: zodResolver(secondStepSchema),
    defaultValues: {
      skillLevel: formData?.skillLevel || "",
      location: formData?.location || "",
      zipcode: formData?.zipcode || "",
      city: formData?.city || "",
      state: formData?.state || "",
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
          name="skillLevel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Skill Level</FormLabel>
              <FormControl>
                <select
                  {...field}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  defaultValue={formData.skillLevel}
                >
                  <option value="">Select your skill level</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                  <option value="Master">Master</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Street Address</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Where are you located?" className="resize-none" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="zipcode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Zipcode</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter your zipcode" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter your city" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="state"
          render={({ field }) => (
            <FormItem>
              <FormLabel>State</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter your state" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          <Button type="button" onClick={onBack} variant="outline" className="flex-1">
            Back
          </Button>
          <Button type="submit" className="flex-1">
            Next
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default StepTwo;