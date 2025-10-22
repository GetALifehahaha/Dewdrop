import {Login, Signup, Layout, Home, Tickets} from './pages'
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
				<Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
					<Route path='/' element={<Home />}/>
					<Route path='/tickets' element={<Tickets />}/>
				</Route>
				<Route path='/login' element={<Login />}/>
				<Route path='/signup' element={<SignupAndLogout />}/>
				<Route path='/logout' element={<Logout />}/>
			</Routes>
		</>
	)
}

export default App
