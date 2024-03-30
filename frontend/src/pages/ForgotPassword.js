import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../components/common/Button'
import Swal from 'sweetalert2'
import apis from '../apis'
import { ImSpinner2 } from 'react-icons/im'
import { IoEye, IoEyeOff, IoArrowBackOutline } from 'react-icons/io5'
import CountDown from '../components/CountDown'
import jwtDecode from 'jwt-decode'

const ForgotPassword = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [stepOne, setStepOne] = useState(true)
    const [stepTwo, setStepTwo] = useState(false)
    const [show, setShow] = useState(false)
    const [token, setToken] = useState(null)

    const [email, setEmail] = useState('')
    const [code, setCode] = useState('')
    const [newPassword, setNewPassword] = useState("")
    const [newConfirmPassword, setNewConfirmPassword] = useState("")
    const [count, setCount] = useState([])

    useEffect(() => {
        const getDecode = async () => {
            try {
                const decode = await jwtDecode(JSON.stringify(token))
                setCount(decode)
            } catch (error) {
                return
            }
        }
        getDecode()
    }, [token])

    const sendOtp = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const res = await apis.post(
                `api/sendOTPOut`,
                { email }
            )
            setLoading(false)
            setStepOne(false)
            setStepTwo(true)
            setToken(res?.data?.token);
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: "open your email to see your code!",
                showConfirmButton: true,
            })
        } catch (error) {
            setLoading(false)
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: error.response.data.message,
                showConfirmButton: false,
            })
        }
    }

    const validateDoReset = (e) => {
        e.preventDefault()
        if (newConfirmPassword !== newPassword) {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'password and confirm password not same!',
                showConfirmButton: true,
            })
        } else {
            DoReset()
        }
    }

    const DoReset = async (e) => {

        setLoading(true)
        try {
            const res = await apis.post('api/forgotpassword',
                {
                    newpassword: newPassword,
                    code: code
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )
            setLoading(false)
            navigate('/login')
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: res.data.message,
                showConfirmButton: true,
            })
        } catch (error) {
            setLoading(false)
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: error.response.data.message,
                showConfirmButton: false,
            })
        }
    }


    let content

    if (stepOne) {
        content = <>
            <p>try to type your email below to send a 6-digit verification code so you can get a new password.</p>
            <form
                className='flex flex-col'
                onSubmit={sendOtp}
            >
                <input
                    type='email'
                    required
                    className='border-b-2 w-[320px] px-2 my-2 outline-0 leading-loose'
                    placeholder='Email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <Button name={loading ? <ImSpinner2 className='animate-spin text-[22px] ' /> : 'Submit'} className='flex justify-center transition duration-200 ease-out bg-[#F6E7E6] mx-16 py-1 outline-0  rounded-md shadow-md mt-[22px] text-[#3A5372] font-bold text-[22px] hover:scale-110' />
            </form>
        </>
    } else
        if (stepTwo) {
            content = <>
                <p>Enter the new password and the verification code sent to your email.</p>
                <CountDown count={count} />
                <form
                    className='flex flex-col'
                    onSubmit={validateDoReset}
                >
                    <input
                        type='number'
                        required
                        className='border-b-2 w-[320px] px-2 my-2 outline-0 leading-loose'
                        placeholder='Code'
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                    />
                    <div className='flex justify-end items-center'>
                        <input
                            type={show ? 'text' : 'password'}
                            className='border-b-2 w-[320px] px-2 my-2 outline-0 leading-loose'
                            placeholder='password'
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        {show
                            ?
                            <IoEyeOff className='absolute mr-2 cursor-pointer' onClick={() => (setShow(false))} />
                            :
                            <IoEye className='absolute mr-2 cursor-pointer' onClick={() => (setShow(true))} />}
                    </div>
                    <div className='flex justify-end items-center'>
                        <input
                            type={'password'}
                            className='border-b-2 w-[320px] px-2 my-2 outline-0 leading-loose'
                            placeholder='confirm password'
                            value={newConfirmPassword}
                            onChange={(e) => setNewConfirmPassword(e.target.value)}
                        />
                    </div>
                    <Button name={loading ? <ImSpinner2 className='animate-spin text-[22px] ' /> : 'Submit'} className='flex justify-center transition duration-200 ease-out bg-[#F6E7E6] mx-16 py-1 outline-0  rounded-md shadow-md mt-[22px] text-[#3A5372] font-bold text-[22px] hover:scale-110' />
                </form>
            </>
        }

    return (
        <div className="flex justify-center items-center bg-Background-login bg-cover h-screen">
            <Link to={'/'}>
                <IoArrowBackOutline className='fixed top-16 left-[170px] text-[25px]' />
            </Link>
            <div className='flex flex-row justify-center w-[75%] h-[85%] bg-white rounded-md bg-[#F1F9F9] shadow-md'>
                <div className='flex flex-col justify-center items-center m-10'>
                    <h1 className='text-[38px] px-10'>
                        forgot your password?
                    </h1>
                    {content}
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword