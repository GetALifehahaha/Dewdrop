import React from 'react'
import {LoginSignupForm} from '../components'

const Login = () => {
  return (
    <div className='flex justify-center items-center w-screen h-screen bg-gradient-to-b from-zinc-950 to-gray-900'>
      <LoginSignupForm method="login"/>
    </div>
  )
}

export default Login
