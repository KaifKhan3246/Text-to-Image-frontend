import { createContext, useEffect, useState } from "react";
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from "react-router-dom";

export const AppContext = createContext()

const AppContextProvider = (props) => {

    const [showLogin, setShowLogin] = useState(false)
    const [token, setToken] = useState(localStorage.getItem('token'))
    const [user, setUser] = useState(null)

    const [credit, setCredit] = useState(0)

    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const navigate = useNavigate()

    // Create axios instance with default config for production
    const apiClient = axios.create({
        baseURL: backendUrl,
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json',
        }
    });

    // Add interceptor to attach token to every request
    apiClient.interceptors.request.use(
        (config) => {
            const currentToken = localStorage.getItem('token');
            if (currentToken) {
                config.headers.Authorization = `Bearer ${currentToken}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    const loadCreditsData = async () => {
        try {
            const { data } = await apiClient.get('/api/user/credits')
            if (data.success) {
                setCredit(data.credits)
                setUser(data.user)
            }

        } catch (error) {
            console.log(error)
            toast.error("Failed to load credits: " + error.message)
        }
    }

    const generateImage = async (prompt) => {
        try {
            const { data } = await apiClient.post('/api/image/generate-image', { prompt })

            if (data.success) {
                loadCreditsData()
                return data.resultImage
            } else {
                toast.error(data.message)
                loadCreditsData()
                if (data.creditBalance === 0) {
                    navigate('/buy')
                }
            }

        } catch (error) {
            toast.error(error.message)
        }
    }

    const logout = () => {
        localStorage.removeItem('token')
        setToken('')
        setUser(null)
    }

    useEffect(()=>{
        if (token) {
            loadCreditsData()
        }
    },[token])

    const value = {
        token, setToken,
        user, setUser,
        showLogin, setShowLogin,
        credit, setCredit,
        loadCreditsData,
        backendUrl,
        generateImage,
        logout,
        apiClient
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )

}

export default AppContextProvider