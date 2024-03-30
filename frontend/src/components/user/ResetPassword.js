import { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import Button from '../common/Button'
import apis from '../../apis'
import Swal from 'sweetalert2'
import CountDownReset from '../CountDownReset'
import jwtDecode from 'jwt-decode'

const ResetPassword = ({ closeModal, token }) => {
    const [newPassword, setNewPassword] = useState("")
    const [newConfirmPassword, setNewConfirmPassword] = useState("")
    const [code, setCode] = useState("")
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



    const DoReset = async (e) => {
        e.preventDefault()
        try {
            if (newPassword !== newConfirmPassword) {
                Swal.fire({
                    position: 'center',
                    icon: 'warning',
                    title: 'password and confirm password not same!',
                    showConfirmButton: true,
                })

                return
            }
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
            closeModal(false)
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: res.data.message,
                showConfirmButton: true,
            })
        } catch (error) {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: error.response.data.message,
                showConfirmButton: false,
            })
        }
    }



    return ReactDOM.createPortal(
        <div className='flex justify-center'>
            <div className="fixed inset-0 bg-gray-300 opacity-80"></div>
            <div className='fixed inset-40 p-2 flex justify-center'>
                <div className='flex justify-center items-center bg-white h-[200px] rounded-md'>
                    <form onSubmit={DoReset}>
                        <div className='bg-white w-[400px] py-4 rounded-md flex flex-col justify-center items-center'>
                            <h1 className='font-bold'>Change Your Password!</h1>
                            <p className='px-4 text-center'>Enter the new password and the verification code sent to your email.</p>
                            <CountDownReset count={count} />
                            <input
                                required
                                type='password'
                                placeholder='New Password'
                                className='border w-[50%] h-[20%] m-2 p-2'
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <input
                                required
                                type='password'
                                placeholder='New Confirm Password'
                                className='border w-[50%] h-[20%] m-2 p-2'
                                value={newConfirmPassword}
                                onChange={(e) => setNewConfirmPassword(e.target.value)}
                            />
                            <input
                                required
                                type='name'
                                placeholder='your Code'
                                className='border w-[50%] h-[20%] m-2 p-2'
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                            />
                            <Button name='Submit' className='bg-blue-500 text-white py-2 px-4 rounded' />
                        </div>
                    </form>
                </div>
            </div>
        </div >,
        document.querySelector('.modal-container')
    )
}

export default ResetPassword