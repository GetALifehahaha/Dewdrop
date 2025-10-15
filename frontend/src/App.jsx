import {Login, Signup} from './pages'
import { HomeReporter } from './pages';
import { ProtectedRoute } from './components';
import {Routes, Route, Navigate} from 'react-router-dom'

const Logout = () => {
  localStorage.clear();

  return <Navigate to='/login' />
}

const SignupAndLogout = () => {
  localStorage.clear()
  return <Signup />
}

function App() {

  return(
    <>
      <Routes>
        <Route path='/' element={
          <ProtectedRoute>
            <HomeReporter />
          </ProtectedRoute>
        } />
        <Route path='/login' element={<Login />}/>
        <Route path='/signup' element={<SignupAndLogout />}/>
        <Route path='/logout' element={<Logout />}/>
      </Routes>
    </>
  )
}

export default App
