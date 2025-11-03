import { LoginSignupForm } from '../components/organisms'
import React from 'react'
import backgroundImg from '../assets/images/blue-minimalist-alien-landscape-c3.jpg'


const Signup = () => {
  return (
    <div className='flex justify-center items-center w-screen h-screen bg-cover' style={{ backgroundImage: `url(${backgroundImg})`}}>
      <LoginSignupForm method="signup"/>
    </div>
  )
}

export default Signup
