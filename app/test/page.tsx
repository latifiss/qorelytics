'use client'

import SocialButton from '@/components/ui/socialButton'
import Switch from '@/components/ui/switch'
import { useState } from 'react';

export default function LoginPage() {
  const [enabled, setEnabled] = useState(false);

  const handleSocialLogin = (provider: string) => {
    console.log(`Signing in with ${provider}`)
  }

  return (
    <div className='flex flex-col gap-4 max-w-sm mx-auto min-h-screen justify-center bg-white dark:bg-[#171b1d] px-4'>
      <div className='flex flex-col gap-4'>
        <SocialButton 
          type='google' 
          onClick={() => handleSocialLogin('google')}
        />
        <SocialButton 
          type='facebook' 
          onClick={() => handleSocialLogin('facebook')}
        />
        
        <div className="flex flex-col gap-3 pt-6 border-t border-neutral-200 dark:border-neutral-800">
          <p className="text-sm text-neutral-500 dark:text-neutral-400 font-medium">
            Feature Toggle
          </p>
          <Switch 
            checked={enabled} 
            onCheckedChange={setEnabled} 
            // label="Enable feature"
            size="md"
          />
          
          <Switch 
            checked={enabled} 
            onCheckedChange={setEnabled} 
            disabled
            label="Disabled"
          />
        </div>
      </div>
    </div>
  )
}