import { useEffect, useState } from 'react'
import { ImSpinner2 } from 'react-icons/im'
import moment from 'moment'
import { NavLink } from 'react-router-dom'
import useAuth from '../../ahooks/useAuth'
import apis, { BaseUrl } from '../../apis'
import Button from '../common/Button'
import DatePicker from 'react-datepicker'
import jwtDecode from 'jwt-decode'
import Swal from 'sweetalert2'

const AttendanceTable = () => {
    const { auth } = useAuth()
    const [data, setData] = useState({
        status: false,
        data: null
    })
    const attend = data?.data
    const [date, setDate] = useState(null)
    const [filter, setFilter] = useState('')
    const [loading, setLoading] = useState(false)
    const [errMessage, setErrMessage] = useState('')
    const [id, setId] = useState(null)
    const [dataId, setDataId] = useState(null)
    const getId = id?.userId

    useEffect(() => {
        const getUser = async () => {
            try {
                const decode = await jwtDecode(JSON.stringify(auth))
                setId(decode)

            } catch (error) {
                return
            }
        }
        getUser()
        const getData = async () => {
            try {
                if (getId === undefined) { return null }
                const response = await apis.get(`/api/user/${getId}`, {
                    headers: {
                        authorization: `Bearer ${auth?.token}`
                    }
                })
                setDataId(response.data.data)
            } catch (error) {
                console.log(error);
            }

        }
        getData()

    }, [auth, getId])



    const filteredAttendance = attend
        ? attend.filter(
            (item) =>
                (item?.id_user?.id_staff?.name && item?.id_user?.id_staff?.name.toLowerCase().includes(filter.toLowerCase())) ||
                (item?.status && item?.status.toLowerCase().includes(filter.toLowerCase()))

        ) : []

    const _toReport = () => {
        if (dataId?.role !== 'HR') {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'you are not HR!',
            })
        } else {
            window.open(`/report/${date ? moment(date).format('YYYY-MM-DD') : null}`, "_blank", 'noreferrer')
        }

    }

    useEffect(() => {
        const fetch = async () => {
            setLoading(true)
            try {
                const response = await apis.get(`api/attendance`, {
                    headers: {
                        Authorization: `Bearer ${auth.token}`
                    },
                    params: {
                        date: date ? `${moment(date).format('YYYY-MM-DD')}` : ''
                    }
                })
                setData(response.data);
                setLoading(false)
            } catch (error) {
                setErrMessage(error.response.data.message)
                setLoading(false)
            }
        }
        fetch()
    }, [auth, date])

    let content

    if (loading) {
        content =
            <div className=' bg-white hover:shadow-xl cursor-pointer rounded-md '>
                <div className='p-4 h-[73px] text-[#3A5372] tracking-wide flex justify-center text-[17px]'><ImSpinner2 className='animate-spin' /></div>
            </div>
    } else if (data.status) {
        content = filteredAttendance ? filteredAttendance.sort((a, b) =>
            moment(a.date).format('YYYYMMDD') - moment(b.date).format('YYYYMMDD'))
            .reverse()
            .map((item, index) =>
                item?.status === 'Weekend'
                    ?
                    null
                    :
                    <NavLink
                        key={index}
                        to={`${item._id}`}
                    >
                        <div className='grid grid-cols-5 bg-white rounded-md mb-2' >
                            <div className='flex flex-col justify-center items-center mx-[20px]'>
                                < img
                                    className='w-[50px] h-[50px] rounded-md border-2 border-[#3A5372]'
                                    src={`${BaseUrl}/${item?.id_user.id_staff.photo}`}
                                    alt='avatar'
                                />
                            </div>
                            <div className='flex justify-center flex-col items-center h-[73px] '>
                                <div className='text-[#3A5372] text-[15px] font-bold'>{item?.id_user.id_staff.name}</div>
                                <div className='text-[#3A5372] text-sm'>{item?.id_user.id_staff.id_division.name}</div>
                            </div>
                            <div className='flex justify-center flex-col items-center  h-[73px] text-[#3A5372] text-[17px]'>{moment(item?.date).format('ddd, DD/MM/YYYY')}</div>
                            <div className='flex justify-center flex-col items-center  h-[73px] text-[#3A5372] text-[17px]'>
                                <Button
                                    className='bg-[#E6F3E5] px-4 text-[#4EAF51] rounded-md text-[16px]'
                                    name={item.status}
                                />
                            </div>
                            <div className='flex justify-center items-center h-[73px] text-[#3A5372] text-[17px] '>
                                {
                                    item.clock_in !== null ? moment(item.clock_in).format('LT') : '--:--'
                                }&nbsp; <strong>-</strong> &nbsp;{
                                    item.clock_out === null ?
                                        '--:--'
                                        :
                                        (
                                            item.clock_out ? moment(item.clock_out).format('LT')
                                                :
                                                'Present'
                                        )
                                }
                            </div>

                        </div>
                    </NavLink>
            ) : []
    } else {
        content =
            <div className='bg-white rounded-md'>
                <div className='p-4 h-[73px] text-[#3A5372] tracking-wide flex justify-center text-[17px]'>{errMessage ? errMessage : data?.message}</div>
            </div>
    }
    return (
        <>
            <div className='fixed bg-[#F1F9F9] w-[75%] mt-[35px]'>

                <div className='flex justify-between mt-[33px] mr-24 ml-2 mb-4'>
                    <DatePicker
                        dateFormat="MMMM yyyy"
                        showMonthYearPicker
                        selected={date}
                        placeholderText='filter by Month and Year'
                        isClearable
                        onChange={(date) => setDate(date)}
                        className='p-2 rounded-md border border-[#C7C9D9] hover: cursor-pointer'
                    />
                    {/* <ExportCsv disable={date} data={filteredAttendance} /> */}

                    <button
                        className='bg-[#F6E7E6] px-2 py-1 rounded-md tracking-wider text-[17px] text-[#3A5372] shadow hover:shadow-md'
                        onClick={_toReport}
                    >
                        Report
                    </button>

                    <input
                        type='name'
                        placeholder='search by name or status'
                        className='p-2 rounded-md border border-[#C7C9D9]'
                        value={filter}
                        onChange={e => setFilter(e.target.value)}
                    />
                </div>
                <div className='w-[92%]'>
                    <div className='grid grid-cols-5'>
                        <div className=''></div>
                        <div className='flex justify-center text-[22px] text-[#C2A3A1]'>Employee</div>
                        <div className='flex justify-center text-[22px] text-[#C2A3A1] '>Date</div>
                        <div className='flex justify-center text-[22px] text-[#C2A3A1] '>Status</div>
                        <div className='flex justify-center items-center text-[22px] text-[#C2A3A1] '>Time</div>
                    </div>
                </div>
            </div >
            <div className='pt-[160px] mb-10'>
                {content}
            </div>
        </>
    )
}

export default AttendanceTable