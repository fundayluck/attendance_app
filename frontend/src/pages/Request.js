import { useState, useEffect } from 'react'
import Button from '../components/common/Button'
import moment from 'moment/moment'
import apis, { BaseUrl } from '../apis'
import useAuth from '../ahooks/useAuth'
import { ImSpinner2 } from 'react-icons/im'
import FormRequest from '../components/request/FormRequest'
import DatePicker from 'react-datepicker'

const Request = () => {
    const { auth } = useAuth()
    const [data, setData] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [date, setDate] = useState(null)
    const getPermit = data
    const getdata = data?.data

    useEffect(() => {
        const getPermit = async () => {
            try {
                setIsLoading(true)
                const response = await apis.get('/api/getPermitById', {
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
            <div className='fixed bg-white rounded-md  w-[69%]'>
                <div className='p-4 h-[73px] text-[#3A5372]  flex justify-center text-[17px]'><ImSpinner2 className='animate-spin' /></div>
            </div>

    } else if
        (getPermit.status === true) {
        content =
            getdata.map((item) =>
                <div className='grid grid-cols-6 bg-white rounded-md mb-2 ' key={item._id} >
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
                        <div className='bg-[#EFEAFC] px-4 font-bold rounded-md tracking-wider text-[17px] text-[#5F30E2] shadow hover:cursor-default'>

                            {
                                item.is_accepted === null ? 'Pending' :
                                    item.is_accepted ? 'Approved' : 'Rejected'
                            }
                        </div>
                    </div>
                </div>
            )

    } else if (getPermit.status === false) {
        content =
            <div className='bg-white rounded-md w-[100%]'>
                <div className='p-4 h-[73px] text-[#3A5372] flex justify-center text-[17px]'>{errorMsg}</div>
            </div>
    }

    const _toForm = () => {
        setShowModal(true)
    }

    const form = <FormRequest setShowModal={setShowModal} />


    return (
        <>
            {showModal && form}
            <div className='fixed bg-[#F1F9F9] mt-[-4px] w-[70%]'>
                <div className='flex justify-between'>
                    <h1 className='text-[26px] font-bold text-[#3A5372]'>Request For</h1>
                </div>
                <Button
                    name='Request For'
                    className='bg-[#F6E7E6] px-4 py-1 rounded-md tracking-wider text-[17px] text-[#C2A3A1] shadow hover:shadow-md mt-4 mb-2'
                    onClick={_toForm}
                />
                <div className='fixed bg-[#F1F9F9] flex justify-between items-center w-[70%] pb-2'>
                    <div className='text-[18px] text-[#C2A3A1] mb-2 mr-10'>History Leaves</div>
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
            <div className='w-[92%] mt-[140px] mb-10' >
                {content}
            </div >
        </>
    )
}

export default Request