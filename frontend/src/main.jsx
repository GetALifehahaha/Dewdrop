import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google'
import emailjs from '@emailjs/browser'

const clientId = import.meta.env.VITE_CLIENT_ID

emailjs.init("uBPIrx3sHJC5Wib6B");

createRoot(document.getElementById('root')).render(
	<BrowserRouter>
		<GoogleOAuthProvider clientId={clientId}>
			<AuthProvider>
				<App />
			</AuthProvider>
		</GoogleOAuthProvider>
	</BrowserRouter>
)
