import { createContext, useEffect, useState, useCallback } from "react";
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from "react-router-dom";

export const AppContext = createContext()

const AppContextProvider = (props) => {

    const [token, setToken] = useState(localStorage.getItem('token'))
    const [user, setUser] = useState(null)

    const [credit, setCredit] = useState(0)

    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const navigate = useNavigate()

    const loadCreditsData = async () => {
        try {

            const { data } = await axios.get(backendUrl + '/api/user/credits')
            if (data.success) {
                setCredit(data.credits)
                setUser(data.user)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const generateImage = async (prompt) => {
        try {

            const { data } = await axios.post(backendUrl + '/api/image/generate-image', { prompt })

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

    const logout = useCallback(() => {
        localStorage.removeItem('token')
        setToken('')
        setUser(null)
    }, [])

    useEffect(()=>{
        if (token) {
            loadCreditsData()
        }
    },[token])

    useEffect(() => {
        const requestInterceptor = axios.interceptors.request.use(
            (config) => {
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`
                }
                return config
            },
            (error) => Promise.reject(error)
        )

        const responseInterceptor = axios.interceptors.response.use(
            (response) => {
                if (response.data && response.data.success === false &&
                    (response.data.message === 'Not Authorized. Login Again' || 
                     response.data.message?.includes('Not Authorized') || 
                     response.data.message?.includes('jwt') || 
                     response.data.message?.includes('token'))) {
                    logout()
                    navigate('/login')
                }
                return response
            },
            (error) => {
                if (error.response && error.response.status === 401) {
                    logout()
                    navigate('/login')
                }
                return Promise.reject(error)
            }
        )

        return () => {
            axios.interceptors.request.eject(requestInterceptor)
            axios.interceptors.response.eject(responseInterceptor)
        }
    }, [token, logout, navigate])

    const value = {
        token, setToken,
        user, setUser,
        credit, setCredit,
        loadCreditsData,
        backendUrl,
        generateImage,
        logout
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )

}

export default AppContextProvider