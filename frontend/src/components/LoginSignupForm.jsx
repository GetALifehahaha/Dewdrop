import React from 'react'

const LoginSignupForm = ({method}) => {

  return (
    <div className='w-full h-screen flex flex-row justify-between p-6'>
      <div className='basis-3/5'>
        <h5 className=''>Dewdrop</h5>
      </div>

        {(method == "login") ?
          <div className='basis-2/5 bg-main rounded-xl px-10 py-14'>
            {/* Welcome block */}
            <div>
              <h1>Welcome Back</h1>
              <h5>Log in to start requesting tickets</h5>
            </div> 

            {/* Input blocks */}
            <div>
              <div>
                <h5>
                  Username
                </h5>
                <input type="text"/>
              </div>
              <div>
                <h5>
                  Password
                </h5>
                <input type="password"/>
              </div>
              <div>
                <h5>Remember Me</h5>
                <h5>Forgot Password</h5>
              </div>
              <button>Login</button>
            </div>

          </div>
          :
          <div className=''>
             
            <h1 className='mt-auto text-center font-bold'>SIGN UP</h1>
            
            <div className="p-4 flex flex-col gap-2">
              <h5 className='font-medium text-black/75 text-sm ml-4'>Username</h5>
              <input type="text" className='px-4 py-1 rounded-full shadow-md bg-white w-full'/>
            </div>
            <div className="p-4 flex flex-col gap-2">
              <h5 className='font-medium text-black/75 text-sm ml-4'>Password</h5>
              <input type="text" className='px-4 py-1 rounded-full shadow-md bg-white w-full'/>
            </div>
            
            <button type="submit" className='px-8 py-2 rounded-full bg-gray-900 text-lg font-semibold tracking-wide text-white text-center cursor-pointer'>Login</button>
          </div>
        }
    </div>
  )
}

export default LoginSignupForm
