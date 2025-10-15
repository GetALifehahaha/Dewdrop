import React, {useState, useEffect} from 'react'
import {Navigate} from 'react-router-dom'
import {jwtDecode} from 'jwt-decode'
import api from '../services/api'
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../services/constants'

const ProtectedRoute = ({children}) => {

  const [isAuthorized, setIsAuthorized] = useState(null);

  useEffect(() => {
    auth().catch(() => setIsAuthorized(false));
  }, [])

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);

    let jsonBody = method == "login" ? {
      username, password
    } : {
      
    } 

    try {
      const res = api.post("/authentication/token/refresh/", 
        {
          refresh: refreshToken
        }
      )
  
      if (res.status === 200) {
        localStorage.setItem(ACCESS_TOKEN, res.data.access)
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
      }
    } catch (err) {
      setIsAuthorized(false);
    }
  }
  
  const auth = async () => {
    const accessToken = localStorage.getItem(ACCESS_TOKEN);

    if (!accessToken) {
      setIsAuthorized(false);
      return;
    }

    const decodedToken = jwtDecode(accessToken);
    const tokenExpiration = decodedToken.exp;
    const now = Date() / 1000;

    if (tokenExpiration < now) {
      await refreshToken();
    } else {
      setIsAuthorized(true);
    }
  }

  if (isAuthorized == null) {
    return <div className="">Loading...</div>
  }

  return isAuthorized ? children : <Navigate to='/login'/>;
  
}

export default ProtectedRoute
