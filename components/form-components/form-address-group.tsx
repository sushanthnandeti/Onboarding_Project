"use client";

import { Control, FieldValues, Path } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface FormAddressGroupProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  hint?: string;
  control: Control<T>;
  required?: boolean;
}

export function FormAddressGroup<T extends FieldValues>({
  name,
  label,
  hint,
  control,
  required = false,
}: FormAddressGroupProps<T>) {
  return (
    <div className="space-y-4">
      <FormLabel className="text-sm font-medium">
        {label}
        {hint && <span className="text-gray-500 ml-1">{hint}</span>}
        {required && <span className="text-red-500 ml-1">*</span>}
      </FormLabel>
      <div className="space-y-3">
        <FormField
          control={control}
          name={`${name}.streetAddress` as Path<T>}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Street Address</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  type="text" 
                  placeholder="Enter your street address"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-3 gap-3">
          <FormField
            control={control}
            name={`${name}.city` as Path<T>}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">City</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    type="text" 
                    placeholder="City"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name={`${name}.state` as Path<T>}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">State</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    type="text" 
                    placeholder="State"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name={`${name}.zipcode` as Path<T>}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Zip Code</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    type="text" 
                    placeholder="Zip Code"
                    maxLength={10}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
} 