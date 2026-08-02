'use client'

import SocialButton from '@/components/ui/socialButton'

export default function LoginPage() {
  const handleSocialLogin = (provider: string) => {
    console.log(`Signing in with ${provider}`)
    // Add your OAuth logic here
  }

  return (
    <div className='flex flex-col gap-4 max-w-sm mx-auto'>
      <SocialButton 
        type='google' 
        onClick={() => handleSocialLogin('google')}
      />
      <SocialButton 
        type='facebook' 
        onClick={() => handleSocialLogin('facebook')}
      />
      {/* <SocialButton 
        type='apple' 
        onClick={() => handleSocialLogin('apple')}
      />
      <SocialButton 
        type='tiktok' 
        onClick={() => handleSocialLogin('tiktok')}
      />
      <SocialButton 
        type='x' 
        onClick={() => handleSocialLogin('x')}
      /> */}
    </div>
  )
}