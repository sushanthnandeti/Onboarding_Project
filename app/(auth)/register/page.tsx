'use client'

import React from 'react'
import RegisterForm from '@/components/auth/register-form'

function page() {
  return (
    <div className='flex min-h-screen'>
      <div className='sticky top-0 h-screen w-1/3 bg-blue-400 bg-formImage bg-cover'>
          
      </div>  
      <div className='w-2/3 flex items-center justify-center p-8'>
        <RegisterForm />
      </div>
    </div>  
  )
}

export default page