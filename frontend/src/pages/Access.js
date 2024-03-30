import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import useAuth from '../ahooks/useAuth'
import apis, { BaseUrl } from '../apis'
import { ImSpinner2 } from 'react-icons/im'
import moment from 'moment'
import DatePicker from 'react-datepicker'

const Access = () => {
    const { auth } = useAuth()
    const [data, setData] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [title, setTitle] = useState('all')
    const [date, setDate] = useState(null)
    const [errorMsg, setErrorMsg] = useState('')
    const getPermit = data
    const getdata = data?.data

    const filteredData = getdata ? getdata.filter(status => (
        title === 'pending' ? status.is_accepted === null :
            title === '1' ? status.is_accepted === 1 :
                title === '0' ? status.is_accepted === 0 :
                    title === 'all' && status
    )) : []

    useEffect(() => {
        const getPermit = async () => {
            try {
                setIsLoading(true)
                const response = await apis.get('/api/getPermit', {
                    headers: {
                        authorization: `Bearer ${auth.token}`
                    },
                    params: {
                        date: date ? `${moment(date).format('YYYY-MM-DD')}` : ''
                    }
                })
                setData(response.data)
                setIsLoading(false)
            } catch (error) {
                setIsLoading(false)
                setData(error.response.data)
                setErrorMsg(error.response.data.message)
            }
        }
        getPermit()
    }, [auth, date])

    let content

    if (isLoading) {
        content =
            <div className='fixed bg-white hover:shadow-xl cursor-pointer rounded-md  w-[69%]'>
                <div className='p-4 h-[73px] text-[#3A5372]  flex justify-center text-[17px]'><ImSpinner2 className='animate-spin' /></div>
            </div>

    } else if
        (getPermit.status === true && filteredData.length > 0) {
        content =
            filteredData ? filteredData.reverse().map((item) => (
                <NavLink key={item._id} to={`${item._id}`} >
                    < div className='grid grid-cols-6 bg-white rounded-md mb-2 hover:shadow-md'>
                        <div className='flex flex-col justify-center items-center mx-[20px]'>
                            < img
                                className='w-[50px] h-[50px] rounded-md border-2 border-[#3A5372]'
                                src={`${BaseUrl}/${item?.id_staff.id_staff?.photo}`}
                                alt='avatar'
                            />
                        </div>
                        <div className='flex justify-center flex-col items-center h-[73px] '>
                            <div className='text-[#3A5372] text-[17px] font-bold'>{item?.id_staff.id_staff.name}</div>
                            <div className='text-[#3A5372] text-sm'>{item?.id_staff.id_staff.id_division.name}</div>
                        </div>
                        <div className='flex justify-center flex-col items-center  h-[73px] text-[#3A5372] text-[17px]'>
                            {moment(item.start_date).format('ddd, DD/MM/YYYY')}
                        </div>
                        <div className='flex justify-center flex-col items-center  h-[73px] text-[#3A5372] text-[17px]'>
                            {moment(item.end_date).format('ddd, DD/MM/YYYY')}
                        </div>
                        <div className='flex justify-center flex-col items-center  h-[73px] text-[#3A5372] text-[17px]'>
                            {item.status}
                        </div>
                        <div className='flex justify-center flex-col items-center  h-[73px] text-[#3A5372] text-[17px]'>
                            <button

                                className={item.is_accepted === 0 || item.is_accepted === 1 ?
                                    "bg-[#EFEAFC] px-4 font-bold rounded-md tracking-wider text-[17px] text-[#5F30E2] shadow"
                                    :
                                    "bg-[#EFEAFC] px-4 font-bold rounded-md tracking-wider text-[17px] text-[#5F30E2] shadow hover:shadow-md"}
                            >
                                {
                                    item.is_accepted === null ? 'Pending' :
                                        item.is_accepted === 1 ? 'Approved' : 'Rejected'
                                }
                            </button>
                        </div>
                    </div >
                </NavLink  >
            )) : []

    } else if (getPermit.status === false) {
        content =
            <div className='bg-white  rounded-md  w-[100%]'>
                <div className='p-4 h-[73px] text-[#3A5372] flex justify-center text-[17px]'>{errorMsg ? errorMsg : getPermit?.message}</div>
            </div>
    } else if (filteredData.length < 1) {
        content =
            <div className='bg-white  rounded-md  w-[100%]'>
                <div className='p-4 h-[73px] text-[#3A5372] flex justify-center text-[17px]'>you don't have records of Permit or Leave</div>
            </div>
    }

    return (
        <>
            <div className='fixed bg-[#F1F9F9] mt-[-4px] w-[75%]'>
                <div className='flex justify-between'>
                    <h1 className='text-[26px] font-bold text-[#3A5372]'>Access Request</h1>
                </div>
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
                    <select
                        className='h-[40px] w-[224px] px-5 border border-[#C7C9D9] rounded'
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    >
                        <option value='all' >All</option>
                        <option value='pending' >Pending</option>
                        <option value='1' >Approve</option>
                        <option value='0' >Reject</option>
                    </select>
                </div>
            </div>
            <div className='w-[92%] mt-[130px] mb-10' >
                {content}
            </div>

        </>

    )
}

export default Access