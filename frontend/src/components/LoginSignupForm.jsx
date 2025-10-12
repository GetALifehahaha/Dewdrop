import React from 'react'

const LoginSignupForm = ({method}) => {

  return (
    <div className={`p-8 rounded-4xl bg-white flex flex-row justify-between w-[60vw] min-h-[60vh] gap-8 ${(method == "login" ? '' : 'flex-row-reverse')}`}>
      <div className='basis-1/2 bg-gradient-to-b from-zinc-900 to-gray-900 rounded-2xl p-4'>
        <h5 className='text-white/75 font-medium'>Dewdrop</h5>
      </div>

        {(method == "login") ?
          <div className='basis-1/2 p-4 flex flex-col h-auto'>
             
            <h1 className='mt-auto text-center font-bold'>LOG IN</h1>
            
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
          :
          <div className='basis-1/2 p-4 flex flex-col h-auto'>
             
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
