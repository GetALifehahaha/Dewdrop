import { LoginSignupForm } from '../components'
import React from 'react'

const Signup = () => {
  return (
    <div className='flex justify-center items-center w-screen h-screen bg-gradient-to-b from-zinc-950 to-gray-900'>
      <LoginSignupForm method="signup" />
    </div>
  )
}

export default Signup
