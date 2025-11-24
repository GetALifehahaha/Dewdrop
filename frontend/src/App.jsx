import { Login, Signup, Layout, Home, Tickets, TicketDetails, NotFound, CreateTicket, EditTicket, CreateAgent, Agents, ResolveTicket } from './pages'
import { ProtectedRoute } from './components/organisms';
import { Routes, Route, Navigate } from 'react-router-dom'

const Logout = () => {
	localStorage.clear();

	return <Navigate to='/login' />
}

const SignupAndLogout = () => {
	localStorage.clear()
	return <Signup />
}

function App() {

	return (
		<>
			<Routes>
				<Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
					<Route path='/' element={<Home />} />
					<Route path='/tickets' element={<Tickets />} />
					<Route path='/tickets/:ticket_id' element={<TicketDetails />} />
					<Route path='/tickets/:ticket_id/edit' element={<EditTicket />} />
					<Route path='/ticket-create' element={<CreateTicket />} />
					<Route path='/agents' element={<Agents />} />
					<Route path='/agent-create' element={<CreateAgent />} />
				</Route>
				<Route path="/resolve/:id" element={<ResolveTicket />} />
				<Route path='/login' element={<Login />} />
				<Route path='/signup' element={<SignupAndLogout />} />
				<Route path='/logout' element={<Logout />} />
				<Route path='*' element={<NotFound />} />
			</Routes>
		</>
	)
}

export default App
