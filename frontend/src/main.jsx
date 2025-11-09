import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google'

createRoot(document.getElementById('root')).render(
	<BrowserRouter>
		<GoogleOAuthProvider clientId="324648686529-g0n26kis5f1jgmfdv2lgetrer83eqrdg.apps.googleusercontent.com">
			<AuthProvider>
				<App />
			</AuthProvider>
		</GoogleOAuthProvider>
	</BrowserRouter>
)
