import { useEffect, useRef, useState } from 'react'
import apis, { BaseUrl } from '../../apis'
import useAuth from '../../ahooks/useAuth'
import { NavLink, useParams, useNavigate } from 'react-router-dom'
import Photo from '../../assets/images/photo.jpg'
import Button from '../common/Button'
import { ImSpinner2 } from 'react-icons/im'
import Swal from 'sweetalert2'

const AddUser = () => {
    const { auth } = useAuth()
    const { id } = useParams()
    const userRef = useRef();
    const navigate = useNavigate()

    const [isLoading, setIsLoading] = useState(false)
    const [user, setUser] = useState([])
    const Staff = user?.data
    const [err, setErr] = useState('')
    const [nip, setNip] = useState('')
    const [name, setName] = useState('')

    // form
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPass, setConfirmPass] = useState('')
    const [role, setRole] = useState('')

    useEffect(() => {
        const getUser = async () => {
            try {
                setIsLoading(true)
                const response = await apis.get(`/api/staff/${id}`, {
                    headers: {
                        authorization: `Bearer ${auth.token}`
                    }
                })
                setUser(response.data)
                setName(response.data.data.name)
                setNip(response.data.data._id)
                setIsLoading(false)
            } catch (error) {

                setIsLoading(false)
            }
        }
        getUser()

    }, [auth, id, password, confirmPass])

    const handleCreate = async (e) => {
        e.preventDefault()
        try {
            setIsLoading(true)
            if (confirmPass !== password) {
                Swal.fire({
                    position: 'center',
                    icon: 'warning',
                    title: 'password and confirm password not same!',
                    showConfirmButton: true,
                })
                setIsLoading(false)
                return
            }
            const response = await apis('/api/create-user', {
                headers: {
                    authorization: `Bearer ${auth.token}`
                },
                method: "POST",
                data: {
                    email,
                    password,
                    role,
                    id_staff: nip
                }
            })

            if (response?.data?.status === true) {
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: "Success created account!",
                    showConfirmButton: true,
                })
                navigate('/people')
                setIsLoading(false)
            }
        } catch (error) {
            if (error.response.status === 400) {
                Swal.fire({
                    position: 'center',
                    icon: 'warning',
                    title: error.response.data.message,
                    showConfirmButton: true,
                })
            } else if (error.response.status === 401) {
                setErr(error.response.data.error)
            }
            setIsLoading(false)
        }
    }

    useEffect(() => {
        userRef.current.focus();
    }, []);

    useEffect(() => {
        setErr("");
    }, [email, password]);

    return (
        <div>
            <h1 className='text-[26px] font-bold text-[#3A5372] mb-5'>Create Account</h1>
            <div className='grid grid-rows-2 grid-flow-col mb-5'>
                <div className='row-span-2'>
                    {Staff ?
                        <img src={`${BaseUrl}/${Staff?.photo}`} alt={Staff?.name} className='ml-5 w-[150px] h-[150px] rounded' />
                        :
                        <img src={Photo} alt='' className='ml-5 w-[150px] h-[150px] rounded' />
                    }
                </div>
                <div className='col-span-2 flex flex-col '>
                    <label className='text-[18px] text-[#3A5372] font-bold pl-1'>NIP</label>
                    <input
                        className='bg-[#F1F9F9] border-b-2 w-[320px] px-2 my-2 outline-0 leading-loose'
                        placeholder='NIP'
                        disabled
                        value={nip}
                        onChange={(e) => setNip(e.target.value)}
                    />
                </div>
                <div className='col-span-2 flex flex-col'>
                    <label className='text-[18px] text-[#3A5372] font-bold pl-1'>Name</label>
                    <input
                        className='bg-[#F1F9F9] border-b-2 w-[320px] px-2 my-2 outline-0 leading-loose'
                        placeholder='Name'
                        disabled
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
            </div>
            <form onSubmit={handleCreate}>
                <div className='grid grid-cols-2'>

                    <div className='flex flex-col '>
                        <label className='text-[18px] text-[#3A5372] font-bold pl-1'>Email</label>
                        <input
                            className='bg-[#F1F9F9] border-b-2 w-[320px] px-2 my-2 outline-0 leading-loose'
                            placeholder='Email'
                            type='email'
                            ref={userRef}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className=' flex flex-col'>
                        <label className='text-[18px] text-[#3A5372] font-bold pl-1'>Position</label>
                        <select value={role} onChange={(e) => setRole(e.target.value)} className="w-[244px] p-2 border border-[#C7C9D9] rounded">
                            <option value=''>Choose the Position</option>
                            <option value="HR">HR</option>
                            <option value="STAFF">STAFF</option>
                            <option value="ADMIN">ADMIN</option>
                        </select>
                    </div>
                    <div className='flex flex-col '>
                        <label className='text-[18px] text-[#3A5372] font-bold pl-1'>Password</label>
                        <input
                            className='bg-[#F1F9F9] border-b-2 w-[320px] px-2 my-2 outline-0 leading-loose'
                            placeholder='Password'
                            type='password'

                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className='flex flex-col '>
                        <label className='text-[18px] text-[#3A5372] font-bold pl-1'>Confirm Password</label>
                        <input
                            className='bg-[#F1F9F9] border-b-2 w-[320px] px-2 my-2 outline-0 leading-loose'
                            placeholder='Confirm Password'
                            type='password'

                            value={confirmPass}
                            onChange={(e) => setConfirmPass(e.target.value)}
                        />
                    </div>
                </div>
                <div>{err}</div>
                <div className='flex justify-center mt-10'>
                    <Button
                        name={isLoading ? <ImSpinner2 className='animate-spin' /> : 'Create'}
                        type='submit'
                        className='bg-[#F6E7E6] h-[40px] px-2 py-1 rounded-md tracking-wider text-[17px] text-[#3A5372] shadow hover:shadow-md mr-2'
                    />
                    <NavLink to='/People'>
                        <Button
                            name='Discard'
                            type='button'
                            className='bg-[#4A77AE] h-[40px] px-2 py-1 rounded-md tracking-wider text-[17px] text-[#FFFFFF] shadow hover:shadow-md '
                        />
                    </NavLink>
                </div>
            </form>
        </div>
    )
}

export default AddUser