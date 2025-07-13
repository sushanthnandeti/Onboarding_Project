'use client'

import React, {useState} from 'react'
import { Progress } from '@/components/ui/progress'
import StepOne from './step-one'
import StepTwo from './step-two'
import StepThree from './step-three'
import { useAction } from 'next-safe-action/hooks'
import { useRouter } from 'next/navigation'
import { UpdateUserOnboarding } from '@/server/actions/onboarding'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function MultiStepForm() {

  const [currentStep, setCurrentStep] = useState<number>(1)
  const [formData, setFormData] = useState<any>({})

  const handleNextStep = (data : any) => {
    setFormData((prev: any) => ({...prev, ...data}))
    setCurrentStep(currentStep + 1);
  }

  const handlePreviousStep = () => {
    setCurrentStep(currentStep - 1);
  }

  const stepText = () => {
    switch(currentStep) {
      case 1: 
        return "Step 1 - Personal Information ";
      case 2: 
        return "Step 2 - Skill Level & Location";
      case 3: 
        return "Step 3 - Preferences & Compensation";
      default:
        return "";
    }
  }

  const router = useRouter();

  const { execute: updateOnboarding } = useAction(UpdateUserOnboarding, {
    onSuccess(data) {
      if (data.data?.error) {
        toast.error(data.data.error);
      } else {
        toast.success("Onboarding complete!");
        router.push("/");
      }
    },
  });

  const finalSubmit = (values: any) => {
    const allData = { ...formData, ...values };
    updateOnboarding(allData);
  }

  const progressValue = (currentStep / 3) * 100;

  return (
        <div className='w-2/3 p-8 flex flex-col'>
            <div className='mb-8'>
                <h1 className='text-2xl font-bold mb-2'>  {stepText()} </h1>
                <Progress value={progressValue} className='h-2'/>
            </div>

            <div className='flex-grow flex flex-col justify-center max-w-md mx-auto w-full'>
                    {currentStep === 1 &&  
                        <StepOne onNext = {handleNextStep} formData={formData}/>
                        }
                    {currentStep === 2 && 
                        <StepTwo onNext = {handleNextStep} onBack = {handlePreviousStep} formData={formData} />
                      }

                    {currentStep === 3 && 
                        <StepThree onBack={handlePreviousStep} handleSubmit={finalSubmit} formData={formData}/> 
                    }

                    <p className="text-center text-gray-600 text-sm mt-6">
                      Already have an account?{" "}
                          <Link
                            href="/login"
                            className="text-blue-600 hover:underline"
                          >
                            Log In
                          </Link>
                </p>
            </div>

            
        </div>
  )
}

