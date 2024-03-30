import React, { useEffect, useState } from 'react'
import { ImSpinner2 } from 'react-icons/im'
import useAuth from '../../ahooks/useAuth'
import apis, { BaseUrl } from '../../apis'
import { AiOutlineSearch } from 'react-icons/ai'
import { Link } from 'react-router-dom'
import Button from '../common/Button'
import StatusCard from '../common/StatusCard'

const Staff = ({ show }) => {
    const { auth } = useAuth()
    const [title, setTitle] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [users, setUsers] = useState([])
    const [errMessage, setErrMessage] = useState([])
    const Users = users?.data

    const filteredStaff = Users
        ? Users.filter(
            (staff) => (staff.email && staff.email.toLowerCase().includes(title.toLowerCase()))
        ) : []

    useEffect(() => {
        const getAllUser = async () => {
            try {
                setIsLoading(true)
                const response = await apis.get('/api/user', {
                    headers: {
                        authorization: `Bearer ${auth.token}`
                    }
                })
                setUsers(response.data)
                setIsLoading(false)
            } catch (error) {
                setIsLoading(false)
                setErrMessage(error.response.data)
            }
        }
        getAllUser()
    }, [auth])

    let content

    if (isLoading) {
        content =
            <div className='fixed bg-white hover:shadow-xl cursor-pointer rounded-md  w-[69%]'>
                <div className='p-4 h-[73px] text-[#3A5372]  flex justify-center text-[17px]'><ImSpinner2 className='animate-spin' /></div>
            </div>

    } else if
        (users.status === true) {
        content =
            filteredStaff ? filteredStaff.map((user) => (
                <div className='grid grid-cols-5 bg-white rounded-md mb-2' key={user._id}>
                    <div className='flex flex-col justify-center items-center mx-[20px]'>
                        < img
                            className='w-[50px] h-[50px] rounded-md border-2 border-[#3A5372]'
                            src={`${BaseUrl}/${user?.id_staff?.photo}`}
                            alt='avatar'
                        />
                    </div>
                    <div className='flex justify-center flex-col items-center h-[73px] text-[#3A5372] text-[17px] font-bold'>
                        {user?.email}
                    </div>
                    <div className='flex justify-center flex-col items-center h-[73px] text-[#3A5372] text-[17px]'>
                        {user?.id_staff?._id}
                    </div>
                    <div className='flex justify-center flex-col items-center h-[73px] text-[#3A5372] text-[17px]'>
                        {user?.role}
                    </div>
                    <div className='flex justify-center flex-col items-center h-[73px]text-[#3A5372] text-[17px]'>
                        <StatusCard status={user?.is_active} />
                    </div>
                </div>
            )
            ) : []
    } else if (errMessage.status === false) {
        content =
            <div className='fixed bg-white hover:shadow-xl cursor-pointer rounded-md  w-[69%]'>
                <div className='p-4 h-[73px] text-[#3A5372] flex justify-center text-[17px]'>{errMessage.data}</div>
            </div>

    }
    return (
        <div className={`${show ? '' : 'hidden'}`}>
            <div className='fixed bg-[#F1F9F9] w-[75%] mt-[35px]'>
                <div className='flex justify-between mt-[33px] mr-24 ml-2 mb-4'>
                    <AiOutlineSearch className='absolute mt-2 ml-1 text-[#555770]' />
                    <input
                        className='h-[30px] px-6 py-1 border border-[#C7C9D9] rounded'
                        placeholder='search of people..'
                        onChange={(e) => setTitle(e.target.value)}
                        value={title}
                    />
                    <Link to='add-employee'>
                        <Button
                            name='Add Employee'
                            className='bg-[#F6E7E6] px-2 py-1 rounded-md tracking-wider text-[17px] text-[#3A5372] shadow hover:shadow-md '
                        />
                    </Link>
                </div>
                <div className='w-[92%]'>
                    <div className='grid grid-cols-5'>
                        <div className=''></div>
                        <div className='flex justify-center text-[22px] text-[#C2A3A1]'>Email</div>
                        <div className='flex justify-center text-[22px] text-[#C2A3A1] '>NIP</div>
                        <div className='flex justify-center text-[22px] text-[#C2A3A1] '>Role</div>
                        <div className='flex justify-center text-[22px] text-[#C2A3A1] '>Status</div>
                    </div>
                </div>
            </div>
            <div className='w-[92%] pt-[160px] mb-10' >
                {content}
            </div>
        </div>
    )
}

export default Staff