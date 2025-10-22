import React, {useState, useContext} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {SquareUser, UserPlus} from 'lucide-react'
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../services/constants';
import api from '../services/api'

const LoginSignupForm = ({method, route}) => {

  // state variables
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("")
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // content variables
  const title = method == 'login' ? 'Welcome back!' : 'Hello there!'
  const greeting = method == 'login' ? 'Log in to continue requesting tickets!' : 'Sign up to start requesting tickets!'
  const submitButton = method == 'login' ? 'Login' : 'Get Started!'

  const submitForm = async (e) => {
    if (method == "signup" && password != passwordAgain) {
      alert("Password entered is incorrect.")
      return;
    }
    setIsLoading(true);
    e.preventDefault()

    const jsonBody = method == "login" ? {
      username, password
    } : {
      first_name: firstName,
      last_name: lastName,
      email: emailAddress,
      username,
      password
    }
    
    try {
      const res = await api.post(route, jsonBody)

      if (method == "login") {

        localStorage.setItem(ACCESS_TOKEN, res.data.access)
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);

        navigate('/')
      } else {
        navigate('/login')
      }
    } catch (err) {
      alert(err)
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className='w-full h-screen flex flex-row justify-between p-6 text-text font-medium'>
      <div className='basis-3/5 p-12 h-[100%] flex flex-col justify-between'>
        {/* Top Part */}
        <div className="flex flex-row justify-between">
          <h5 className='text-main text-2xl font-medium'>Dewdrop</h5>
            {
              (method == "login") ? 
              <div className='flex flex-row items-center gap-2 text-main-dark'>
                <SquareUser strokeWidth={1} />
                <Link to={'/signup'} className='px-2 py-1 rounded-md bg-main-dark text-text'>Sign Up</Link>
              </div>
              : 
              <div className='flex flex-row items-center gap-2 text-main-dark'>
                <Link to={'/login'} className='px-2 py-1 rounded-md bg-main-dark text-text'>Log In</Link>
                <UserPlus strokeWidth={1} />
              </div>
            }
        </div>

        {/* Bottom Part */}
        <div className='text-main/25 font-medium flex text-sm'>
          <h5>Powered By: React | Django | Tailwind CSS</h5>
        </div>
      </div>
      
      {/* Input Form */}
      <div className='basis-2/5 bg-main rounded-xl p-16 flex flex-col'>
            {/* Welcome block */}
            <div className='flex flex-col gap-0.5'>
              <h1 className='text-4xl font-extrabold'>{title}</h1>
              <h5 className='text-lg'>{greeting}</h5>
            </div> 

            {/* Input blocks */}
            <form onSubmit={submitForm} className='flex flex-col gap-2 my-8'>

              {/* First name input block */}
              {(method == 'signup') ?
                <div className=''>
                  <h5 className='ml-2'>
                    First name
                  </h5>
                  <input onChange={(e) => setFirstName(e.target.value)} type="text" placeholder='Enter your first name' className='px-6 py-2 bg-main-light w-full rounded-sm shadow-sm'/>
                </div> : ''
              }

              {/* Last name input block */}
              {(method == 'signup') ?
                <div className=''>
                  <h5 className='ml-2'>
                    Last name
                  </h5>
                  <input onChange={(e) => setLastName(e.target.value)} type="text" placeholder='Enter your last name' className='px-6 py-2 bg-main-light w-full rounded-sm shadow-sm'/>
                </div> : ''
              }

              {/* Email input block */}
              {(method == 'signup') ?
                <div className=''>
                  <h5 className='ml-2'>
                    Email Address
                  </h5>
                  <input onChange={(e) => setEmailAddress(e.target.value)} type="text" placeholder='Enter your email address' className='px-6 py-2 bg-main-light w-full rounded-sm shadow-sm'/>
                </div> : ''
              }

              
              {/* Username input block */}
              <div className=''>
                <h5 className='ml-2'>
                  Username
                </h5>
                <input onChange={(e) => setUsername(e.target.value)} type="text" placeholder='Enter your username' className='px-6 py-2 bg-main-light w-full rounded-sm shadow-sm'/>
              </div>

              {/* Password input block */}
              <div>
                <h5 className='ml-2'>
                  Password
                </h5>
                <input onChange={(e) => setPassword(e.target.value)} type="password" placeholder='Enter your password' className='px-6 py-2 bg-main-light w-full rounded-sm shadow-sm'/>
                {(method == 'signup') ? 
                  <input onChange={(e) => setPasswordAgain(e.target.value)} type="password" placeholder='Enter password again' className='px-6 py-2 mt-1 bg-main-light w-full rounded-sm shadow-sm'/> : ''
                }
              </div>

              {/* Other options block */}
              {(method == 'login') ?  
                <div className='flex flex-row justify-between text-text/50'>
                  <div className="flex gap-2">
                    <input type='checkbox' className='cursor-pointer hover:text-text/75' /> {/* Should be a checkbox */}
                    <label className='cursor-pointer hover:text-text/75'>Remember me</label>
                  </div>
                  <h5 className='cursor-pointer hover:text-text/75'>Forgot Password</h5>
                </div> : ''
              }

              <button type='submit' className='w-fit px-24 py-2 mt-4 mx-auto rounded-2xl bg-accent-deepblue text-main cursor-pointer'>{submitButton}</button>
            </form>

            <hr className='text-text/25 my-4 w-7/8 mx-auto rounded-full'/>

          </div>
    </div>
  )
}

export default LoginSignupForm
