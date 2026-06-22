import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'

const Login = () => {

    const [state, setState] = useState('Login')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const { setShowLogin, setToken, setUser, apiClient } = useContext(AppContext)

    const onSubmitHandler = async (e) => {
        e.preventDefault()
        setIsLoading(true)

        try {

            if (state === 'Login') {

                const { data } = await apiClient.post('/api/user/login', { email, password })

                if (data.success) {
                    setToken(data.token)
                    setUser(data.user)
                    localStorage.setItem('token', data.token)
                    setShowLogin(false)
                    toast.success('Login successful!')
                } else {
                    toast.error(data.message)
                }

            } else {

                const { data } = await apiClient.post('/api/user/register', { name, email, password })

                if (data.success) {
                    setToken(data.token)
                    setUser(data.user)
                    localStorage.setItem('token', data.token)
                    setShowLogin(false)
                    toast.success('Account created successfully!')
                } else {
                    toast.error(data.message)
                }

            }



        } catch (error) {
            console.error('Auth Error:', error)
            const errorMessage = error.response?.data?.message || error.message || 'Authentication failed'
            toast.error(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }



    useEffect(() => {
        // Disable scrolling on body when the login is open
        document.body.style.overflow = 'hidden';

        // Cleanup function to re-enable scrolling
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    return (
        <div className=' absolute top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center'>
            <motion.form onSubmit={onSubmitHandler} className='relative bg-white p-10 rounded-xl text-slate-500'
                initial={{ opacity: 0.2, y: 50 }}
                transition={{ duration: 0.3 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
            >

                <h1 className='text-center text-2xl text-neutral-700 font-medium'>{state}</h1>

                <p className='text-sm'>Welcome back! Please sign in to continue</p>

                {state !== 'Login' && <div className='border px-6 py-2 flex items-center gap-2 rounded-full mt-5'>
                    <img src={assets.email_icon} alt="" />
                    <input onChange={e => setName(e.target.value)} value={name} className='outline-none text-sm' type="text" placeholder='Full Name' required />
                </div>}

                <div className='border px-6 py-2 flex items-center gap-2 rounded-full mt-4'>
                    <img src={assets.email_icon} alt="" />
                    <input onChange={e => setEmail(e.target.value)} value={email} className='outline-none text-sm' type="email" placeholder='Email id' required />
                </div>

                <div className='border px-6 py-2 flex items-center gap-2 rounded-full mt-4'>
                    <img src={assets.lock_icon} alt="" />
                    <input onChange={e => setPassword(e.target.value)} value={password} className='outline-none text-sm' type="password" placeholder='Password' />
                </div>

                <p className='text-sm text-blue-600 my-4 cursor-pointer'>Forgot password?</p>

                <button className='bg-blue-600 w-full text-white py-2 rounded-full'>{state === 'Login' ? 'login' : 'create account'}</button>

                {state === "Login"
                    ? <p className='mt-5 text-center'>Don't have an account? <span onClick={() => setState('Sign Up')} className='text-blue-600 cursor-pointer'>Sign up</span></p>
                    : <p className='mt-5 text-center'>Already have an account? <span onClick={() => setState('Login')} className='text-blue-600 cursor-pointer'>Login</span></p>
                }

                <img onClick={() => setShowLogin(false)} className=' absolute top-5 right-5 cursor-pointer' src={assets.cross_icon} alt="" />
            </motion.form>
        </div>
    )
}

export default Login