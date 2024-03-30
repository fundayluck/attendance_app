import React, { useEffect, useState } from 'react'
import useAuth from '../../ahooks/useAuth'
import { NavLink } from 'react-router-dom'
import Photo from '../../assets/images/photo.jpg'
import apis, { BaseUrl } from '../../apis'
import jwtDecode from 'jwt-decode'
import moment from 'moment'
import Button from '../common/Button'
import Swal from 'sweetalert2'
import ResetPassword from './ResetPassword'


const DetailUser = () => {
    const { auth } = useAuth()
    const [id, setId] = useState([])
    const [user, setUser] = useState([])
    const [staff, setStaff] = useState([])
    const getId = id?.userId
    const getStaffByUser = user?.data?.id_staff?._id
    const Staff = staff?.data
    const [showModal, setShowModal] = useState(false)
    const [token, setToken] = useState(null)

    const modal = <ResetPassword
        closeModal={setShowModal}
        token={token}
    />

    const doSendOTP = async () => {
        try {
            const res = await apis.post(
                `api/sendOTPIn`,
                { email: user?.data?.email, },
                {
                    headers: {
                        authorization: `Bearer ${auth?.token}`
                    }
                }
            )
            setToken(res?.data?.token);
            setShowModal(true)
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: "open your email to see your code!",
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

    const handleForgotPass = async () => {
        Swal.fire({
            title: 'Are you sure?',
            text: "to change your password",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, change password!'
        }).then((result) => {
            if (result.isConfirmed) {
                doSendOTP()
            }
        })
    }

    useEffect(() => {
        const getUser = async () => {
            try {
                const decode = await jwtDecode(JSON.stringify(auth))
                setId(decode)
            }
            catch (error) {
                return
            }
        }
        getUser()
        const User = async () => {
            if (getId === undefined) { return null }
            const response = await apis.get(`/api/user/${getId}`, {
                headers: {
                    authorization: `Bearer ${auth.token}`
                }
            })
            setUser(response.data)
        }
        User()
        const Staff = async () => {
            if (getStaffByUser === undefined) { return null }
            const response = await apis.get(`/api/staff/${getStaffByUser}`, {
                headers: {
                    authorization: `Bearer ${auth.token}`
                }
            })
            setStaff(response.data);
        }
        Staff()
    }, [auth, getId, getStaffByUser])

    return (
        <>
            {showModal && modal}
            <div>
                <div className='flex items-center mb-4'>
                    <h1 className='text-[26px] font-bold text-[#3A5372]'>Employee Information</h1>
                </div>
                <div className='flex mb-2 mx-8'>
                    <div className='mr-[134px]'>
                        {Staff ?
                            <img src={`${BaseUrl}/${Staff?.photo}`} alt='' className='ml-5 w-[150px] h-[150px] rounded' />
                            :
                            <img src={Photo} alt='' className='ml-5 w-[150px] h-[150px] rounded' />
                        }
                    </div>
                    <div className='flex flex-col'>
                        <NavLink to={`edit/${getStaffByUser}`}>
                            <Button
                                name='Edit Employee'
                                className='bg-[#F6E7E6] h-[40px] w-[170px] px-2 py-1 rounded-md tracking-wider text-[17px] text-[#3A5372] shadow hover:shadow-md  mb-2'
                            />
                        </NavLink>
                        {/* <NavLink> */}
                        <Button
                            onClick={handleForgotPass}
                            name='Change Password'
                            className='bg-[#F6E7E6] h-[40px] w-[170px] px-2 py-1 rounded-md tracking-wider text-[17px] text-[#3A5372] shadow hover:shadow-md  mb-2'
                        />
                        {/* </NavLink> */}
                    </div>

                </div>
                <div className='grid grid-cols-2  ml-12 mr-[25%]'>
                    <div className=' flex flex-col'>
                        <label className='text-[20px] text-[#3A5372] font-bold pl-1'>NIP</label>
                        <div className='p-2 text-[18px] text-[#3A5372]'>{Staff?._id}</div>
                    </div>
                    <div className=' flex flex-col'>
                        <label className='text-[20px] text-[#3A5372] font-bold pl-1'>Name</label>
                        <div className='p-2 text-[18px] text-[#3A5372]'>{Staff?.name}</div>
                    </div>
                    <div className='flex flex-col'>
                        <label className='text-[20px] text-[#3A5372] font-bold pl-1'>Position</label>
                        <div className='p-2 text-[18px] text-[#3A5372]'>{Staff?.id_division?.name}</div>
                    </div>
                    <div className='flex flex-col'>
                        <label className='text-[20px] text-[#3A5372] font-bold pl-1'>Phone</label>
                        <div className='p-2 text-[18px] text-[#3A5372]'>{Staff?.phone}</div>
                    </div>
                    <div className='flex flex-col'>
                        <label className='text-[20px] text-[#3A5372] font-bold pl-1'>Area</label>
                        <div className='p-2 text-[18px] text-[#3A5372]'>{Staff?.area}</div>
                    </div>
                    <div className='flex flex-col'>
                        <label className='text-[20px] text-[#3A5372] font-bold pl-1'>Address</label>
                        <div className='p-2 text-[18px] text-[#3A5372]'>{Staff?.address}</div>
                    </div>
                    <div className='flex flex-col'>
                        <label className='text-[20px] text-[#3A5372] font-bold pl-1'>Date Birth</label>
                        <div className='p-2 text-[18px] text-[#3A5372]'>{moment(Staff?.birth).format('DD MMMM YYYY')}</div>
                    </div>
                    <div className='flex flex-col '>
                        <label className='text-[20px] text-[#3A5372] font-bold pl-1'>Gender</label>
                        <div className='p-2 text-[18px] text-[#3A5372]'>{Staff?.gender}</div>
                    </div>
                    <div className='flex flex-col'>
                        <label className='text-[20px] text-[#3A5372] font-bold pl-1'>NIK</label>
                        <div className='p-2 text-[18px] text-[#3A5372]'>{Staff?.NIK}</div>
                    </div>
                </div>
            </div >
        </>
    )
}

export default DetailUser