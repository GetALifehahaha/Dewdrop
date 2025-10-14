import React from 'react'
import {LoginSignupForm} from '../components'
import backgroundImg from '../assets/images/blue-minimalist-alien-landscape-c3.jpg'


const Login = () => {
  return (
    <div className='flex justify-center items-center w-screen h-screen bg-cover' style={{ backgroundImage: `url(${backgroundImg})`}}>
      <LoginSignupForm method="login"/>
    </div>
  )
}

export default Login
