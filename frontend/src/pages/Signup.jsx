import { LoginSignupForm } from '../components'
import React from 'react'
import backgroundImg from '../assets/images/blue-minimalist-alien-landscape-c3.jpg'


const Signup = () => {
  return (
    <div className='flex justify-center items-center w-screen h-screen bg-cover' style={{ backgroundImage: `url(${backgroundImg})`}}>
      <LoginSignupForm method="signup" route={"/authentication/user/register/"}/>
    </div>
  )
}

export default Signup
