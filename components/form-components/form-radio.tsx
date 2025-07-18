"use client";

import { Control, FieldPath, FieldValues } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface FormRadioProps<T extends FieldValues> {
  name: FieldPath<T>;
  label: string;
  options: string[];
  hint?: string;
  control: Control<T>;
  required?: boolean;
}

export function FormRadio<T extends FieldValues>({
  name,
  label,
  options,
  hint,
  control,
  required = false,
}: FormRadioProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-sm font-medium">
            {label}
            {hint && <span className="text-gray-500 ml-1">{hint}</span>}
            {required && <span className="text-red-500 ml-1">*</span>}
          </FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="flex flex-row gap-8 mt-2"
            >
              {options.map(option => (
                <FormItem key={option} className="flex items-center space-x-2">
                  <FormControl>
                    <RadioGroupItem value={option} />
                  </FormControl>
                  <FormLabel className="font-normal capitalize">{option}</FormLabel>
                </FormItem>
              ))}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
} 