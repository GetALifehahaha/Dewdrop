import React, { createContext, useState, useEffect} from 'react'
import {jwtDecode} from 'jwt-decode'
import api from '../services/api'
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../services/constants'

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {

    const [user, setUser] = useState(null);
    const [isAuthorized, setIsAuthorized] = useState(null);

    useEffect(() => {
        auth().catch(() => {setIsAuthorized(false); setUser(null)})
    }, []);

    const auth = async () => {
        const accessToken = localStorage.getItem(ACCESS_TOKEN);
        
        if (!accessToken) {
            setUser(null);
            setIsAuthorized(false);
            return;        
        }

        const decodedToken = jwtDecode(accessToken);
        setUser({});
        const tokenExpiration = decodedToken.exp;
        const currentDate = Date.now() / 1000;

        if (tokenExpiration < currentDate){
            await refreshToken();
        } else {
            getUserData();
            setIsAuthorized(true);
        }
    }

    const refreshToken = async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);

        if (!refreshToken) {
            setUser(null);
            setIsAuthorized(false);
            return;    
        }

        try {
            const response = await api.post('/authentication/token/refresh/', {
                refresh: refreshToken,
            });
            localStorage.setItem(ACCESS_TOKEN, response.data.access);
            setIsAuthorized(true);
        } catch (err) {
            setUser(null);
            setIsAuthorized(false);
        }
    }

    const getUserData = async () => {
        try {
            const response = await  api.get('/authentication/user/');
            const userData = response.data
            setUser(userData);
        } catch {
            setUser(null);
        }
    }

    return (
        <AuthContext.Provider value={{user, isAuthorized, setUser, setIsAuthorized}}>
            {children}
        </AuthContext.Provider>
    )
}




