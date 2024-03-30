import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ImSpinner2 } from 'react-icons/im'
import { IoEye, IoEyeOff } from 'react-icons/io5'
import Logo from '../assets/logo/Logo.png'
import apis from '../apis'
import useAuth from '../ahooks/useAuth'


const Login = () => {
    const { setAuth } = useAuth();
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errorMsg, setErrorMsg] = useState('')
    const [show, setShow] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const userRef = useRef();
    const navigate = useNavigate()

    useEffect(() => {
        userRef.current.focus();
    }, []);

    useEffect(() => {
        setErrorMsg("");
    }, [email, password]);

    const doLogin = async (e) => {
        e.preventDefault()
        try {
            setIsLoading(true);
            const response = await apis.post('/api/login', {
                email,
                password
            })
            const token = response?.data
            setAuth({ status: token.status, token: token.token, user: token.user })
            setEmail('')
            setPassword('')
            navigate('/')
            setIsLoading(false)
        } catch (error) {
            if (error.code === "ERR_NETWORK") {
                setIsLoading(false)
                setErrorMsg(error.message)
            }
            else {
                setIsLoading(false)
                setErrorMsg(error.response.data.error)
            }
        }
    }

    const clearMessage = (e) => {
        e.preventDefault()
        setErrorMsg('')
    }


    return (
        <div className="flex flex-col justify-center items-center bg-Background-login bg-cover h-screen">
            <div className='w-[75%] h-[85%] bg-white rounded-md bg-[#F1F9F9] shadow-md'>
                <div className='grid grid-cols-2 gap-4 h-full'>
                    <div className='flex flex-col justify-center p-4'>
                        <div className='flex flex-col items-center'>
                            <h1 className='flex text-[38px]'>
                                Welcome,<span className='text-[#3A5372]'>&nbsp;Farmers!</span>
                            </h1>
                            <h3 className='text-[18px] text-[#3A5372] mb-5'>Please, sign in with your Account</h3>
                            <form className='flex flex-col' onSubmit={doLogin}>
                                <input
                                    ref={userRef}
                                    type='email'
                                    className='border-b-2 w-[320px] px-2 my-2 outline-0 leading-loose'
                                    placeholder='Email'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <div className='flex justify-end items-center'>
                                    <input
                                        type={show ? 'text' : 'password'}
                                        className='border-b-2 w-[320px] px-2 my-2 outline-0 leading-loose'
                                        placeholder='password'
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    {show
                                        ?
                                        <IoEyeOff className='absolute mr-2 cursor-pointer' onClick={() => (setShow(false))} />
                                        :
                                        <IoEye className='absolute mr-2 cursor-pointer' onClick={() => (setShow(true))} />}
                                </div>

                                <div className={`transition duration-200 ease-out bg-[#FDE4E1] border text-red-700  rounded relative  ${errorMsg ? 'scale-10 mt-[12px] px-4 py-3' : 'scale-0'}`} role="alert">
                                    <span className="block sm:inline">{errorMsg}</span>
                                    <span className="absolute top-0 bottom-0 right-0 px-4 py-3" >
                                        <svg
                                            className="fill-current h-6 w-6 text-black-500"
                                            onClick={clearMessage}
                                            role="button"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20">
                                            <title>
                                                Close
                                            </title>
                                            <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" /></svg>
                                    </span>
                                </div>

                                <button
                                    type="submit"
                                    className='transition duration-200 ease-out bg-[#F6E7E6] flex justify-center mx-8 py-2 outline-0  rounded-md shadow-md mt-[22px] text-[#3A5372] font-bold text-[22px] hover:scale-110'
                                >
                                    {isLoading ? <ImSpinner2 className='animate-spin text-[22px]' /> : 'Sign in'}
                                </button>
                            </form>
                            <Link to={'/forgot-password'} className='text-[#3A5372] mt-[14px]'>Forgot Password ?</Link>
                        </div>
                    </div>
                    <div className='flex flex-col justify-center p-4'>
                        <img src={Logo} alt='' width={500} height={500} />
                    </div>
                </div>
            </div>
        </div>
    )
}


export default Login