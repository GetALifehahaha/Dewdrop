import React, { createContext, useState, useEffect} from 'react'
import {jwtDecode} from 'jwt-decode'
import api from '../services/api'
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../services/constants'
import { useNavigate } from 'react-router-dom'

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {

    const [user, setUser] = useState(null);
    const [isAuthorized, setIsAuthorized] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const initApp = async () => {
            try {
                await auth();
            } catch {
                setIsAuthorized(false);
                setUser(null);

                if (
                    !window.location.pathname.includes('/login') &&
                    !window.location.pathname.includes('/register')
                ) {
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        }

        initApp();
    }, []);

    const auth = async () => {
        const accessToken = localStorage.getItem(ACCESS_TOKEN);
        
        if (!accessToken) {
            setUser(null);
            setIsAuthorized(false);
            return;        
        }

        const decodedToken = jwtDecode(accessToken);
        const tokenExpiration = decodedToken.exp;
        const currentDate = Date.now() / 1000;

        if (tokenExpiration < currentDate){
            await refreshToken();
        } else {
            await getUserData();
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
            await getUserData();
            setIsAuthorized(true);
        } catch (err) {
            setUser(null);
            setIsAuthorized(false);
        }
    }

    const getUserData = async () => {
        try {
            const response = await api.get('/authentication/user/');
            const userData = response.data
            setUser(userData);
        } catch {
            setUser(null);
        }
    }

    const login = async (username, password) => {
        const response = await api.post('/authentication/token/', {username, password});

        localStorage.setItem(ACCESS_TOKEN, response.data.access);
        localStorage.setItem(REFRESH_TOKEN, response.data.refresh);

        await getUserData();
        setIsAuthorized(true);
    }
    
    const logout = () => {
        localStorage.removeItem(ACCESS_TOKEN);
        localStorage.removeItem(REFRESH_TOKEN);
        setUser(null);
        setIsAuthorized(false);
    };

    const register = async (username, password, first_name, last_name, email) => {
        try {
            const response = await api.post('/authentication/user/register/', {username, password, first_name, last_name, email});
        } catch (err) {
            alert(err)
        }
    }

    return (
        <AuthContext.Provider value={{user, isAuthorized, setUser, login, register, setIsAuthorized, loading}}>
            {children}
        </AuthContext.Provider>
    )
}




