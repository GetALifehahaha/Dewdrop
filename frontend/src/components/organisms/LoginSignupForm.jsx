import React, {useState, useContext, useEffect} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {Loader2, SquareUser, UserPlus} from 'lucide-react'
import { AuthContext } from '../../context/AuthContext';
import { GoogleLoginService } from '../../services';
import { Toast } from '../molecules';
import { X, Check } from 'lucide-react';

const LoginSignupForm = ({method}) => {
  // context variables
  const {login, register} = useContext(AuthContext);

  // state variables
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [toastMessages, setToastMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  // content variables
  const title = method == 'login' ? 'Welcome back!' : 'Hello there!'
  const greeting = method == 'login' ? 'Log in to continue requesting tickets!' : 'Sign up to start requesting tickets!'
  const submitButton = method == 'login' ? 'Login' : 'Get Started!'

  useEffect(() => {
      if (toastMessages.length > 0) {
          const timer = setTimeout(() => setToastMessages([]), 3000);
          return () => clearTimeout(timer);
      }
  }, [toastMessages]);

  // form function
  const submitForm = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (method === "login") {
        const result = await login(username, password);

        if (result.success) {
          setToastMessages([
            { message: "Login successful! Redirecting...", status: "success", icon: Check }
          ]);
          setTimeout(() => navigate('/'), 1000);
        } else {
          setToastMessages([
            { message: "No account found with this credentials", status: "error", icon: X }
          ]);
        }
        
      } else if (method === "signup") {
        if (password !== passwordAgain) {
          setToastMessages([
            { message: "Passwords don't match", status: "error", icon: X }
          ]);
          return;
        }

        const result = await register(username, password, firstName, lastName, emailAddress);
        
        if (result.success) {
          setToastMessages([
            { message: "Registration successful! Please login.", status: "success", icon: Check }
          ]);
          setTimeout(() => navigate('/login'), 1000);
        } else {
          let errorMessage = "Registration failed";
          
          if (typeof result.error === 'object') {
            const firstError = Object.values(result.error)[0];
            errorMessage = Array.isArray(firstError) ? firstError[0] : firstError;
          } else {
            errorMessage = result.error || errorMessage;
          }
          setToastMessages([
            { message: errorMessage, status: "error", icon: X }
          ]);
        }
      }
    } catch (err) {
      setToastMessages([
        { message: "An unexpected error occurred. Please try again.", status: "error", icon: X }
      ]);
    } finally {
      setLoading(false); // Optional: reset loading state
    }
}

  return (
    <div className='w-full h-screen flex flex-row justify-between p-6 text-text font-medium'>
      <Toast toastMessages={toastMessages} />
      
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
              </div>

              {
                loading
                ? <div className='flex gap-2 items-center mx-auto py-2 mt-4 font-semibold text-base'><Loader2 size={18} className='animate-spin' /> {method ? <h5 className='animate-pulse'>Logging in...</h5> : <h5 className='animate-pulse'>Signing up...</h5>}</div>
                : <button type='submit' className='w-fit px-24 py-2 mt-4 mx-auto rounded-2xl bg-accent-deepblue text-main cursor-pointer'>{submitButton}</button>
              }
            
              <hr className='text-text/25 my-4 w-7/8 mx-auto rounded-full'/>

              <GoogleLoginService type={method} />
            </form>


          </div>
    </div>
  )
}

export default LoginSignupForm
