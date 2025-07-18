'use client'

import React, { useState, useEffect } from 'react'
import { Progress } from '@/components/ui/progress'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { OnboardingSchema } from '@/types/onboarding-schema'
import { Button } from '@/components/ui/button'
import { Form} from '@/components/ui/form'
import { FormInput, FormTextarea, FormSelect, FormRadio, FormAddressGroup } from '@/components/form-components'
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
  const [formData, setFormData] = useState<Record<string, unknown>>({})
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
    onError() {
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
      
      const defaultValues = currentStepFields.reduce((acc: Record<string, unknown>, key: string) => {
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
      }, {} as Record<string, unknown>)
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

  const handleStep = (step: number, data: Record<string, unknown>) => {
    setFormData((prev) => ({ ...prev, ...data }))
    setCurrentStep(step)
  }

  const finalSubmit = (values: Record<string, unknown>) => {
    const allData = { ...formData, ...values };
    
   
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
    updateOnboarding(mappedData as Parameters<typeof updateOnboarding>[0]);
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function DynamicFields({ fields, form }: { fields: string[], form: ReturnType<typeof useForm<any>> }) {
  const renderField = (field: string) => {
    const config = FIELD_CONFIG[field];
    if (!config) return null;

    switch (config.type) {
      case "address-group":
        return (
          <FormAddressGroup
            key={field}
            name={field}
            label={config.label}
            hint={config.hint}
            control={form.control}
            required
          />
        );

      case "textarea":
        return (
          <FormTextarea
            key={field}
            name={field}
            label={config.label}
            placeholder={config.placeholder}
            hint={config.hint}
            control={form.control}
            required
          />
        );

      case "input":
        return (
          <FormInput
            key={field}
            name={field}
            label={config.label}
            type={config.inputType}
            placeholder={config.label}
            maxLength={config.maxLength}
            hint={config.hint}
            control={form.control}
            required
          />
        );

      case "select":
        return (
          <FormSelect
            key={field}
            name={field}
            label={config.label}
            options={config.options || []}
            placeholder={`Select your ${config.label.toLowerCase()}`}
            hint={config.hint}
            control={form.control}
            required
          />
        );

      case "radio":
        return (
          <FormRadio
            key={field}
            name={field}
            label={config.label}
            options={config.options || []}
            hint={config.hint}
            control={form.control}
            required
          />
        );

      default:
        return null;
    }
  };

  return <>{fields.map(renderField)}</>;
}