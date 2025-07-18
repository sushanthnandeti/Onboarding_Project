"use client";

import { Control, FieldPath, FieldValues } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

interface FormTextareaProps<T extends FieldValues> {
  name: FieldPath<T>;
  label: string;
  placeholder?: string;
  hint?: string;
  control: Control<T>;
  required?: boolean;
  minHeight?: string;
}

export function FormTextarea<T extends FieldValues>({
  name,
  label,
  placeholder,
  hint,
  control,
  required = false,
  minHeight = "min-h-[100px]",
}: FormTextareaProps<T>) {
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
            <Textarea
              {...field}
              placeholder={placeholder || label}
              className={`resize-none ${minHeight}`}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
} 