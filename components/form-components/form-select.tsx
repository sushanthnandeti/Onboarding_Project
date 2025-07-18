"use client";

import { Control, FieldPath, FieldValues } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface FormSelectProps<T extends FieldValues> {
  name: FieldPath<T>;
  label: string;
  options: string[];
  placeholder?: string;
  hint?: string;
  control: Control<T>;
  required?: boolean;
}

export function FormSelect<T extends FieldValues>({
  name,
  label,
  options,
  placeholder,
  hint,
  control,
  required = false,
}: FormSelectProps<T>) {
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
            <select
              {...field}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              defaultValue={field.value}
            >
              <option value="">{placeholder || `Select your ${label.toLowerCase()}`}</option>
              {options.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
} 