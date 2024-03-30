import { useEffect, useState } from 'react'
import { Link, NavLink, useParams } from 'react-router-dom'
import useAuth from '../../ahooks/useAuth'
import { BiArrowBack } from 'react-icons/bi'
import {
    IoTimeOutline as In,
    IoTimeSharp as Out,
    IoTimerOutline as TotalHour
} from 'react-icons/io5'
import Button from '../common/Button'
import apis, { BaseUrl } from '../../apis'
import moment from 'moment'
import Photo from '../../assets/images/photo.jpg'
import MapAttendance from './MapAttendance'


const DetailAttendance = () => {
    const { auth } = useAuth()
    const { id } = useParams()
    const [data, setData] = useState([])
    const [showModal, setShowModal] = useState(false)
    const get = data?.data
    const _toMapAttendance = () => {
        setShowModal(true)
    }

    useEffect(() => {
        const getAttend = async () => {
            const response = await apis.get(`api/attendancebyid/${id}`, {
                headers: {
                    authorization: `Bearer ${auth.token}`
                }
            })
            setData(response.data);
        }
        getAttend()
    }, [auth, id])

    const map = <MapAttendance data={get} closeModal={setShowModal} />

    return (
        <>
            <div>
                {showModal && map}
            </div>
            <div className='flex items-center mb-4'>
                <NavLink to='/attendance' className='hover:bg-gray-200 mr-4'>
                    <BiArrowBack className='text-[25px] font-bold' />
                </NavLink>
                <h1 className='text-[26px] font-bold text-[#3A5372]'>Detail Attendance</h1>
            </div>
            <div className='bg-[#FEFEFE] border border-[#000000] mx-10 rounded-md'>
                <div className='flex justify-end p-5 text-[#3A5372]'>
                    {get?.date ? moment(get?.date).format('dddd, DD MMMM YYYY') : null}
                </div>
                <div className='flex justify-around p-2 '>
                    <div className='mb-4'>
                        {get ?
                            < img
                                className='w-[125px] h-[125px] rounded-md border border-[#3A5372] m-2'
                                src={`${BaseUrl}/${get?.id_user?.id_staff?.photo}`}
                                alt='avatar'
                            />
                            :
                            < img
                                className='w-[125px] h-[125px] rounded-md border border-[#3A5372] m-2'
                                src={Photo}
                                alt='avatar'
                            />
                        }
                        <h1 className='text-[#3A5372] font-bold text-[18px] m-2'>
                            {get?.id_user.id_staff.name}
                        </h1>
                        <h3 className='text-[#3A5372] font-normal text-[18px] m-2'>{get?.id_user.id_staff.id_division.name}</h3>
                        <div className='flex items-center'>
                            <p className='text-[#3A5372] font-bold text-[15px] m-2'> Status :</p>
                            <Button
                                className='bg-[#E6F3E5] px-4 text-[#4EAF51] font-bold rounded-md text-[16px] ml-1'
                                name={get?.status}
                            />
                        </div>
                    </div>
                    <div className='flex flex-col'>
                        <div className='flex items-center text-[#3A5372] font-bold mx-5'>
                            <In className='mr-2 text-[20px]' /> Clock In
                        </div>
                        <p className='flex justify-center text-[30px] text-[#3A5372]'>
                            {
                                get?.clock_out === null ?
                                    '--:--'
                                    :
                                    moment(get?.clock_in).format('LT')
                            }
                        </p>
                        {
                            get?.photo === null
                                ?

                                < img
                                    className='w-[125px] h-[125px] rounded-md border border-[#3A5372] m-2'
                                    src={Photo}
                                    alt='avatar'
                                />
                                : (
                                    get?.photo[0].clock_in
                                        ?
                                        < img
                                            className='w-[125px] h-[125px] rounded-md border border-[#3A5372] m-2'
                                            src={`${BaseUrl}/${get?.photo[0].clock_in}`}
                                            alt='avatar'
                                        />
                                        :
                                        < img
                                            className='w-[125px] h-[125px] rounded-md border border-[#3A5372] m-2'
                                            src={Photo}
                                            alt='avatar'
                                        />
                                )
                        }
                    </div>
                    <div className='flex flex-col '>
                        <div className='flex items-center text-[#3A5372] font-bold mx-5'>
                            <Out className='mr-2 text-[20px]' /> Clock Out
                        </div>
                        <p className='flex justify-center text-[30px] text-[#3A5372]'>
                            {
                                get?.clock_out === null ?
                                    '--:--'
                                    :
                                    get?.clock_out === undefined
                                        ?
                                        'Present'
                                        :
                                        moment(get?.clock_out).format('LT')
                            }
                        </p>
                        {
                            get?.photo === null
                                ?
                                < img
                                    className='w-[125px] h-[125px] rounded-md border border-[#3A5372] m-2'
                                    src={Photo}
                                    alt='avatar'
                                />

                                :
                                get?.photo[1]?.clock_out === undefined
                                    ?
                                    < img
                                        className='w-[125px] h-[125px] rounded-md border border-[#3A5372] m-2'
                                        src={Photo}
                                        alt='avatar'
                                    />
                                    :
                                    get?.photo[1]?.clock_out !== null
                                        ?
                                        < img
                                            className='w-[125px] h-[125px] rounded-md border border-[#3A5372] m-2'
                                            src={get?.photo ? `${BaseUrl}/${get?.photo[1]?.clock_out}` : Photo}
                                            alt='avatar'
                                        />
                                        :
                                        < img
                                            className='w-[125px] h-[125px] rounded-md border border-[#3A5372] m-2'
                                            src={Photo}
                                            alt='avatar'
                                        />
                        }
                    </div>
                    <div className='flex flex-col '>
                        <div className='flex items-center text-[#3A5372] font-bold mx-5'>
                            <TotalHour className='mr-2 text-[20px]' /> Total Hours
                        </div>
                        <p className='flex justify-center text-[30px] text-[#3A5372]'>
                            {
                                get?.totalhours === null || get?.totalhours === undefined
                                    ?
                                    '--:--'
                                    :
                                    get?.totalhours
                            }
                        </p>
                        <Link onClick={_toMapAttendance} className='flex justify-center text-[15px] text-blue-500 underline'>Location</Link>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DetailAttendance