import React, { useEffect, useState } from 'react'
import { AiOutlineSearch } from 'react-icons/ai'
import useAuth from '../../ahooks/useAuth'
import apis, { BaseUrl } from '../../apis'
import { ImSpinner2 } from 'react-icons/im'
import { Link, NavLink } from 'react-router-dom'
import Button from '../common/Button'


const Users = ({ show }) => {
    const { auth } = useAuth()
    const [isLoading, setIsLoading] = useState(false)
    const [title, setTitle] = useState('')
    const [staffs, setStaffs] = useState([])
    const [errMessage, setErrMessage] = useState([])
    const Staffs = staffs?.data

    const filteredStaff = Staffs
        ? Staffs.filter(
            (staff) => (staff.name && staff.name.toLowerCase().includes(title.toLowerCase()))
        ) : []

    useEffect(() => {
        const getAllUser = async () => {
            try {
                setIsLoading(true)
                const response = await apis.get('/api/staff', {
                    headers: {
                        authorization: `Bearer ${auth.token}`
                    }
                })
                setStaffs(response.data)
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
                <div className='p-4 h-[73px] text-[#3A5372] tracking-wide flex justify-center text-[17px]'><ImSpinner2 className='animate-spin' /></div>
            </div>

    } else if
        (staffs.status === true) {
        content =
            filteredStaff ? filteredStaff.map((user) => (
                <NavLink to={`${user._id}`} key={user._id} >
                    <div className='grid grid-cols-5 bg-white cursor-pointer rounded-md mb-2 hover:shadow-md' >
                        <div className='flex flex-col justify-center items-center mx-[20px]'>
                            < img
                                className='w-[50px] h-[50px] rounded-md border-2 border-[#3A5372]'
                                src={`${BaseUrl}/${user.photo}`}
                                alt='avatar'
                            />
                        </div>
                        <div className='flex justify-center flex-col items-center  h-[73px] text-[#3A5372] text-[17px] font-bold'>
                            {user.name}
                        </div>
                        <div className='flex justify-center flex-col items-center  h-[73px] text-[#3A5372] text-[17px]'>{user.id_division.name}</div>
                        <div className='flex justify-center flex-col items-center  h-[73px] text-[#3A5372] text-[17px]'>{user.phone}</div>
                        <div className='flex justify-center flex-col items-center  h-[73px] text-[#3A5372] text-[17px] '>{user.area}</div>
                    </div>
                </NavLink >

            )
            ) : []
    } else if (errMessage.status === false) {
        content =
            <div className='fixed bg-white hover:shadow-xl cursor-pointer rounded-md  w-[69%]'>
                <div className='p-4 h-[73px] text-[#3A5372] tracking-wide flex justify-center text-[17px]'>{errMessage.data}</div>
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
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <Link to='list-nip'>
                        <Button
                            name='Create Account'
                            className='bg-[#F6E7E6] px-2 py-1 rounded-md tracking-wider text-[17px] text-[#3A5372] shadow hover:shadow-md '
                        />
                    </Link>
                </div>
                <div className='w-[92%]'>
                    <div className='grid grid-cols-5'>
                        <div className=''></div>
                        <div className='flex justify-center text-[22px] text-[#C2A3A1]'>Employee</div>
                        <div className='flex justify-center text-[22px] text-[#C2A3A1] '>Position</div>
                        <div className='flex justify-center text-[22px] text-[#C2A3A1] '>Phone</div>
                        <div className='flex justify-center text-[22px] text-[#C2A3A1] '>Area</div>
                    </div>
                </div>
            </div>
            <div className='w-[92%] pt-[160px] mb-10' >
                {content}
            </div>
        </div >
    )
}

export default Users