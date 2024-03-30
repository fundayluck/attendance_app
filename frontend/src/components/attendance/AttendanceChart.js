import React, { useEffect, useState } from 'react'
import Charts from './Chart'
import { AiFillStar } from 'react-icons/ai'
import Photo from '../../assets/images/photo.jpg'
import apis, { BaseUrl } from '../../apis'
import useAuth from '../../ahooks/useAuth'
import DatePicker from 'react-datepicker'
import { ImSpinner2 } from 'react-icons/im'
import moment from 'moment'

export const USERS_PER_PAGE = 5

const AttendanceChart = () => {
    const { auth } = useAuth()
    const [users, setUsers] = useState([])
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0);
    const [date, setDate] = useState(null)
    const [loading, setLoading] = useState(false)
    const [errMessage, setErrMessage] = useState('')
    const startIndex = (page - 1) * USERS_PER_PAGE;
    const selectedUsers = users.slice(startIndex, startIndex + USERS_PER_PAGE);
    const pages = [...Array(totalPages).keys()].map(number => number + 1);
    const [dt, setDt] = useState([])

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await apis.get('api/chart', {
                    headers: {
                        Authorization: `Bearer ${auth.token}`
                    },
                    params: {
                        date: date ? `${moment(date).format('YYYY-MM-DD')}` : ''
                    }
                })
                setDt(response.data.data);
            } catch (error) {
                console.log(error);
            }
        }
        getData()
    }, [auth, date])

    useEffect(() => {
        const fetch = async () => {
            setLoading(true)
            try {
                const response = await apis.get('api/ratings', {
                    headers: {
                        Authorization: `Bearer ${auth.token}`
                    }, params: {
                        date: date ? `${moment(date).format('YYYY-MM-DD')}` : ''
                    }
                })
                setUsers(response.data)
                setTotalPages(Math.ceil(response.data.length / USERS_PER_PAGE))
                setLoading(false)
            } catch (error) {
                setLoading(false)
                setErrMessage(error.response.data.message)
            }
        }
        fetch()
    }, [auth, date])

    const handleClick = (number) => {
        setPage(number);
    };

    return <>
        <div className='flex flex-col pt-[80px] mt-2 mb-10'>
            <div className='fixed bg-[#F1F9F9] mt-[-55px] w-[70%] '>
                <div className='flex justify-center items-center mt-2 mb-1 mr-4'>
                    <DatePicker
                        dateFormat="MMMM yyyy"
                        showMonthYearPicker
                        selected={date}
                        placeholderText='filter by Month and Year'
                        isClearable
                        onChange={(date) => setDate(date)}
                        className='p-2 rounded-md border border-[#C7C9D9] hover: cursor-pointer'
                    />
                </div>
            </div>
            <>
                {
                    errMessage !== '' ?
                        <div className='flex flex-col justify-center  bg-white w-[100%] rounded-md shadow-md mb-10'>
                            <div className='p-4 h-[73px] text-[#3A5372] tracking-wide flex justify-center text-[17px]'>{errMessage}</div>
                        </div>
                        :
                        loading ?
                            <div className='flex flex-col justify-center  bg-white w-[100%] rounded-md shadow-md mb-10'>
                                <div className='p-4 h-[73px] text-[#3A5372] tracking-wide flex justify-center text-[17px]'><ImSpinner2 className='animate-spin' size={25} /></div>
                            </div>
                            :
                            <div className='bg-white w-[100%] rounded-md shadow-sm mb-10'>
                                {selectedUsers.map((item, index) =>
                                    <div className='grid grid-cols-4  my-4' key={index} >
                                        <div className='flex flex-col justify-center items-center '>
                                            {item?.staff?.id_staff?.photo === undefined ?
                                                < img
                                                    className='w-10 h-10 rounded outline-0'
                                                    src={Photo}
                                                    alt='avatar'
                                                />
                                                :
                                                < img
                                                    className='w-[50px] h-[50px] rounded-md border-2 border-[#3A5372]'
                                                    src={`${BaseUrl}/${item?.staff?.id_staff?.photo}`}
                                                    alt='avatar'
                                                />
                                            }
                                        </div>
                                        <div className='flex justify-center flex-col items-center'>
                                            <div className='text-[#3A5372] text-sm font-bold'>{item?.staff?.id_staff?.name}</div>
                                            <div className='text-[#3A5372] text-sm text-center'>{item?.staff?.id_staff?.id_division?.name}</div>
                                        </div>
                                        <div className='flex justify-center flex-col text-center items-center text-[#3A5372] italic text-sm '>
                                            "{item.message}"
                                        </div>
                                        <div className='flex justify-center flex-row items-center text-[#3A5372] text-sm'>
                                            {
                                                item.persentage === 0 ?
                                                    null
                                                    :
                                                    item.persentage <= 20 ?
                                                        <AiFillStar color='orange' />
                                                        :
                                                        item.persentage <= 40 ?
                                                            <>
                                                                <AiFillStar color='orange' />
                                                                <AiFillStar color='orange' />
                                                            </>
                                                            :
                                                            item.persentage <= 60 ?
                                                                <>
                                                                    <AiFillStar color='orange' />
                                                                    <AiFillStar color='orange' />
                                                                    <AiFillStar color='orange' />
                                                                </>
                                                                :
                                                                item.persentage <= 80 ?
                                                                    <>
                                                                        <AiFillStar color='orange' />
                                                                        <AiFillStar color='orange' />
                                                                        <AiFillStar color='orange' />
                                                                        <AiFillStar color='orange' />
                                                                    </>
                                                                    :
                                                                    item.persentage <= 100 ?
                                                                        <>
                                                                            <AiFillStar color='orange' />
                                                                            <AiFillStar color='orange' />
                                                                            <AiFillStar color='orange' />
                                                                            <AiFillStar color='orange' />
                                                                            <AiFillStar color='orange' />
                                                                        </>
                                                                        : null
                                            }
                                        </div>
                                    </div>
                                )}
                                <div className="flex justify-center mb-2">
                                    {pages.map(number => (
                                        <button
                                            key={number}
                                            onClick={() => handleClick(number)}
                                            className={`${page === number && 'bg-[#991f5d] text-white'} border mx-[1px] px-1 rounded`}
                                        >
                                            {number}
                                        </button>
                                    ))}
                                </div>
                            </div>
                }
            </>
            <div className='bg-white rounded-md shadow-md '>
                <Charts dt={dt} />
            </div>
        </div>
    </>
}

export default AttendanceChart