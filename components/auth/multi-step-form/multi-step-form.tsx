'use client'

import React, { useState, useEffect } from 'react'
import { Progress } from '@/components/ui/progress'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { OnboardingSchema } from '@/types/onboarding-schema'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { useAction } from 'next-safe-action/hooks'
import { UpdateUserOnboarding } from '@/server/actions/onboarding'
import { GetOnboardingAssignments } from '@/server/actions/assignments'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { signOut } from "next-auth/react";
import { z } from 'zod'

// UI Field Configuration
type FieldConfig = {
  label: string;
  type: "input" | "textarea" | "select" | "radio" | "address-group";
  inputType?: "text" | "date";
  placeholder?: string;
  maxLength?: number;
  options?: string[];
  hint?: string;
};

const FIELD_CONFIG: Record<string, FieldConfig> = {
  aboutMe: {
    label: "About Me",
    type: "textarea",
    placeholder: "Tell us about yourself",
    hint: "(min 10 characters, required)"
  },
  birthdate: {
    label: "Date of Birth",
    type: "input",
    inputType: "date",
    hint: "(required)"
  },
  address: { 
    label: "Address", 
    type: "address-group", 
    hint: "(all address fields required)" 
  },
  skillLevel: {
    label: "Skill Level",
    type: "select",
    options: ["Beginner", "Intermediate", "Advanced", "Expert", "Master"],
    hint: "(required)"
  },
  onsite: {
    label: "Are you willing to work onsite?",
    type: "radio",
    options: ["yes", "no"],
    hint: "(required)"
  },
  compensation: {
    label: "Required Compensation",
    type: "textarea",
    placeholder: "Describe your compensation requirements",
    hint: "(required)"
  }
};

const STEP_TITLES = {
  1: "Step 1 - Personal Information",
  2: "Step 2 - Skill Level & Location", 
  3: "Step 3 - Preferences & Compensation"
} as const;


const createStepSchema = (stepFields: string[]) => {
  const schemaFields: Record<string, z.ZodTypeAny> = {};
  
  stepFields.forEach(field => {
    switch (field) {
      case 'aboutMe':
        schemaFields[field] = OnboardingSchema.shape.aboutMe;
        break;
      case 'birthdate':
        schemaFields[field] = OnboardingSchema.shape.birthdate;
        break;
      case 'address':
        schemaFields[field] = OnboardingSchema.shape.address;
        break;
      case 'skillLevel':
        schemaFields[field] = OnboardingSchema.shape.skillLevel;
        break;
      case 'onsite':
        schemaFields[field] = OnboardingSchema.shape.onsite;
        break;
      case 'compensation':
        schemaFields[field] = OnboardingSchema.shape.compensation;
        break;
    }
  });
  
  return z.object(schemaFields);
};

export default function MultiStepForm() {
  const [currentStep, setCurrentStep] = useState<number>(1)
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [assignments, setAssignments] = useState<Record<number, string[]> | null>(null)
  const [loading, setLoading] = useState(true)
  const [stepFields, setStepFields] = useState<string[]>([])

 
  const stepSchema = createStepSchema(stepFields);
  type StepFormData = z.infer<typeof stepSchema>;

  const form = useForm<StepFormData>({
    defaultValues: {},
    mode: "onChange",
    resolver: zodResolver(stepSchema)
  })

  const { execute: getAssignments } = useAction(GetOnboardingAssignments, {
    onSuccess(data) {
      if (data.data?.data) {
        setAssignments(data.data.data);
      } else if (data.data?.error) {
        toast.error(data.data.error);
      }
      setLoading(false);
    },
    onError(error) {
      toast.error("Failed to load assignments");
      setLoading(false);
    }
  });

  useEffect(() => {
    getAssignments({});
  }, [getAssignments]);

  useEffect(() => {
    if (!loading && assignments) {
      const currentStepFields = assignments[currentStep] || [];
      setStepFields(currentStepFields);
      
      const defaultValues = currentStepFields.reduce((acc: Record<string, any>, key: string) => {
        if (key === 'address') {
          acc[key] = formData[key] || {
            streetAddress: "",
            city: "",
            state: "",
            zipcode: ""
          }
        } else {
          acc[key] = formData[key] || ""
        }
        return acc
      }, {} as Record<string, any>)
      form.reset(defaultValues)
    }
  }, [loading, assignments, currentStep, formData, form])

  const { execute: updateOnboarding } = useAction(UpdateUserOnboarding, {
    onSuccess(data) {
      if (data.data?.error) {
        toast.error(data.data.error)
      } else {
        toast.success("Onboarding complete!")
        signOut({ callbackUrl: "/register" });
      }
    },
    onError(error) {
      toast.error("Something went wrong. Please try again.");
      console.error("Onboarding error:", error);
    }
  })

  const keyMap: Record<string, string> = {
    dob: "birthdate",
    location: "streetAddress",
  };

  const handleStep = (step: number, data: Record<string, any>) => {
    setFormData((prev) => ({ ...prev, ...data }))
    setCurrentStep(step)
  }

  const finalSubmit = (values: Record<string, any>) => {
    const allData = { ...formData, ...values };
    
    // Flatten grouped address data for database storage
    let processedData = { ...allData };
    if (allData.address && typeof allData.address === 'object') {
      processedData = {
        ...processedData,
        address: allData.address, 
      };
    }
    
    const mappedData = Object.fromEntries(
      Object.entries(processedData).map(([k, v]) => [keyMap[k] || k, v])
    );
    updateOnboarding(mappedData as any);
  };

  const progressValue = (currentStep / 3) * 100

  if (loading || !assignments) {
    return <div>Loading onboarding form...</div>
  }

  const onSubmit = async (values: StepFormData) => {
    try {
      if (currentStep < 3) {
        handleStep(currentStep + 1, values)
      } else {
        finalSubmit(values)
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("Something went wrong. Please try again.");
    }
  }

  return (
    <div className='w-2/3 p-8 flex flex-col'>
      <div className='mb-8'>
        <h1 className='text-2xl font-bold mb-2'>
          {STEP_TITLES[currentStep as keyof typeof STEP_TITLES]}
        </h1>
        <Progress value={progressValue} className='h-2' />
      </div>

      <div className='flex-grow flex flex-col justify-center max-w-md mx-auto w-full'>
        <FormProvider {...form}>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-8 p-8">
              <DynamicFields fields={stepFields} form={form} />
              <div className="flex gap-4">
                {currentStep > 1 && (
                  <Button type="button" onClick={() => setCurrentStep(currentStep - 1)} variant="outline" className="flex-1">
                    Back
                  </Button>
                )}
                <Button type="submit" className="flex-1">
                  {currentStep === 3 ? "Submit" : "Next"}
                </Button>
              </div>
              <p className="text-center text-gray-600 text-sm mt-6">
                Already have an account?{" "}
                <Link href="/login" className="text-blue-600 hover:underline">
                  Log In
                </Link>
              </p>
            </form>
          </Form>
        </FormProvider>
      </div>
    </div>
  )
}

function DynamicFields({ fields, form }: { fields: string[], form: ReturnType<typeof useForm<any>> }) {
  const renderField = (field: string) => {
    const config = FIELD_CONFIG[field];
    if (!config) return null;

    if (config.type === "address-group") {
      return (
        <div key={field} className="space-y-4">
          <FormLabel className="text-sm font-medium">
            {config.label}
            {config.hint && <span className="text-gray-500 ml-1">{config.hint}</span>}
          </FormLabel>
          <div className="space-y-3">
            <FormField
              control={form.control}
              name={`${field}.streetAddress`}
              render={({ field: f }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Street Address</FormLabel>
                  <FormControl>
                    <Input 
                      {...f} 
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
                control={form.control}
                name={`${field}.city`}
                render={({ field: f }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">City</FormLabel>
                    <FormControl>
                      <Input 
                        {...f} 
                        type="text" 
                        placeholder="City"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`${field}.state`}
                render={({ field: f }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">State</FormLabel>
                    <FormControl>
                      <Input 
                        {...f} 
                        type="text" 
                        placeholder="State"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`${field}.zipcode`}
                render={({ field: f }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Zip Code</FormLabel>
                    <FormControl>
                      <Input 
                        {...f} 
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

    return (
      <FormField
        key={field}
        control={form.control}
        name={field}
        render={({ field: f }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium">
              {config.label}
              {config.hint && <span className="text-gray-500 ml-1">{config.hint}</span>}
            </FormLabel>
            <FormControl>
              {config.type === "textarea" ? (
                <Textarea 
                  {...f} 
                  placeholder={config.placeholder || config.label} 
                  className="resize-none min-h-[100px]" 
                />
              ) : config.type === "input" ? (
                <Input 
                  {...f} 
                  type={config.inputType} 
                  placeholder={config.label}
                  maxLength={config.maxLength}
                />
              ) : config.type === "select" ? (
                <select
                  {...f}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  defaultValue={f.value}
                >
                  <option value="">Select your skill level</option>
                  {config.options?.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              ) : config.type === "radio" ? (
                <RadioGroup
                  onValueChange={f.onChange}
                  defaultValue={f.value}
                  className="flex flex-row gap-8 mt-2"
                >
                  {config.options?.map(option => (
                    <FormItem key={option} className="flex items-center space-x-2">
                      <FormControl>
                        <RadioGroupItem value={option} />
                      </FormControl>
                      <FormLabel className="font-normal capitalize">{option}</FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              ) : null}
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  };

  return <>{fields.map(renderField)}</>;
}