'use client'

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const thirdStepSchema = z.object({
  onsite: z.enum(["yes", "no"], { message: "Please select an option" }),
  compensation: z.string().min(1, "Please enter your required compensation"),
});

interface StepThreeProps {
  onBack: () => void;
  handleSubmit: (data: any) => void;
  formData: any;
}

const StepThree = ({ onBack, handleSubmit, formData }: StepThreeProps) => {
  const form = useForm({
    resolver: zodResolver(thirdStepSchema),
    defaultValues: {
      onsite: formData?.onsite || "",
      compensation: formData?.compensation || "",
    },
  });

  const onSubmit = (values: any) => {
    handleSubmit({ ...formData, ...values });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-8 p-8">
        <FormField
          control={form.control}
          name="onsite"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Are you willing to work onsite?</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-row gap-8 mt-2"
                >
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value="yes" />
                    </FormControl>
                    <FormLabel className="font-normal">Yes</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value="no" />
                    </FormControl>
                    <FormLabel className="font-normal">No</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="compensation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Required Compensation</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Enter your required compensation" className="resize-none" />
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
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default StepThree;