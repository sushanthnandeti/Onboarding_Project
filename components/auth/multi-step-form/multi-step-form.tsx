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
import { useRouter } from 'next/navigation'
import { UpdateUserOnboarding } from '@/server/actions/onboarding'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { signOut } from "next-auth/react";

const FIELD_LABELS: Record<string, string> = {
  aboutMe: "About Me",
  birthdate: "Date of Birth",
  streetAddress: "Street Address",
  city: "City",
  state: "State",
  zipcode: "Zip Code",
  skillLevel: "Skill Level",
  onsite: "Are you willing to work onsite?",
  compensation: "Required Compensation",
}

const FIELD_TYPES: Record<string, "input" | "textarea" | "select" | "radio"> = {
  aboutMe: "textarea",
  birthdate: "input",
  streetAddress: "input",
  city: "input",
  state: "input",
  zipcode: "input",
  skillLevel: "select",
  onsite: "radio",
  compensation: "textarea",
}

const SKILL_LEVELS = ["Beginner", "Intermediate", "Advanced", "Expert", "Master"]


export default function MultiStepForm() {
  const [currentStep, setCurrentStep] = useState<number>(1)
  const [formData, setFormData] = useState<any>({})
  const [assignments, setAssignments] = useState<Record<number, string[]> | null>(null)
  const [loading, setLoading] = useState(true)


  const form = useForm({
    resolver: zodResolver(OnboardingSchema),
    defaultValues: {},
  })

  useEffect(() => {
    async function fetchAssignments() {
      const res = await fetch('/api/auth/assignments');
      const assignments = await res.json();
      setAssignments(assignments);
      setLoading(false);
    }
    fetchAssignments();
  }, []);

  useEffect(() => {
    if (!loading && assignments) {
      const stepFields = assignments[currentStep] || []
      const defaultValues = stepFields.reduce((acc: Record<string, any>, key: string) => {
        acc[key] = formData[key] || ""
        return acc
      }, {} as Record<string, any>)
      form.reset(defaultValues)
    }

  }, [loading, assignments, currentStep, formData, form])

  const router = useRouter()

  const { execute: updateOnboarding } = useAction(UpdateUserOnboarding, {
    onSuccess(data) {
      if (data.data?.error) {
        toast.error(data.data.error)
      } else {
        toast.success("Onboarding complete!")
        // Log out and redirect to login or register
        signOut({ callbackUrl: "/register" });
      }
    },
  })

  const keyMap: Record<string, string> = {
    dob: "birthdate",
    location: "streetAddress",
   
  };

  const handleStep = (step: number, data: any) => {
    setFormData((prev: any) => ({ ...prev, ...data }))
    setCurrentStep(step)
  }

  const finalSubmit = (values: any) => {
    const allData = { ...formData, ...values };
    const mappedData = Object.fromEntries(
      Object.entries(allData).map(([k, v]) => [keyMap[k] || k, v])
    );
    updateOnboarding(mappedData as any);
  };

  const progressValue = (currentStep / 3) * 100

  if (loading || !assignments) {
    return <div>Loading onboarding form...</div>
  }

  const stepFields = assignments[currentStep] || []

  const onSubmit = (values: any) => {
    if (currentStep < 3) {
      handleStep(currentStep + 1, values)
    } else {
      finalSubmit(values)
    }
  }

  return (
    <div className='w-2/3 p-8 flex flex-col'>
      <div className='mb-8'>
        <h1 className='text-2xl font-bold mb-2'>
          {currentStep === 1 && "Step 1 - Personal Information"}
          {currentStep === 2 && "Step 2 - Skill Level & Location"}
          {currentStep === 3 && "Step 3 - Preferences & Compensation"}
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
                    <Link
                      href="/login"
                      className="text-blue-600 hover:underline"
                    >
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



function DynamicFields({ fields, form }: { fields: string[], form: any }) {
  return (
    <>
      {fields.map((field) => {
        if (FIELD_TYPES[field] === "textarea") {
          return (
            <FormField
              key={field}
              control={form.control}
              name={field}
              render={({ field: f }) => (
                <FormItem>
                  <FormLabel>{FIELD_LABELS[field]}</FormLabel>
                  <FormControl>
                    <Textarea {...f} placeholder={FIELD_LABELS[field]} className="resize-none" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )
        }
        if (FIELD_TYPES[field] === "input") {
          return (
            <FormField
              key={field}
              control={form.control}
              name={field}
              render={({ field: f }) => (
                <FormItem>
                  <FormLabel>{FIELD_LABELS[field]}</FormLabel>
                  <FormControl>
                    <Input {...f} type={field === "birthdate" ? "date" : "text"} placeholder={FIELD_LABELS[field]} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )
        }
        if (FIELD_TYPES[field] === "select") {
          return (
            <FormField
              key={field}
              control={form.control}
              name={field}
              render={({ field: f }) => (
                <FormItem>
                  <FormLabel>{FIELD_LABELS[field]}</FormLabel>
                  <FormControl>
                    <select
                      {...f}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      defaultValue={f.value}
                    >
                      <option value="">Select your skill level</option>
                      {SKILL_LEVELS.map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )
        }
        if (FIELD_TYPES[field] === "radio") {
          return (
            <FormField
              key={field}
              control={form.control}
              name={field}
              render={({ field: f }) => (
                <FormItem>
                  <FormLabel>{FIELD_LABELS[field]}</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={f.onChange}
                      defaultValue={f.value}
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
          )
        }
        return null
      })}
    </>
  )
}