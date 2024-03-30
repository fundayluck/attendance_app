import Button from '../components/common/Button'
import Moment from 'react-moment'
import { useGeolocated } from 'react-geolocated'
import Photo from '../assets/images/photo.jpg'
import { Fragment, useEffect, useState } from 'react'
import AttendanceStep from '../components/AttendanceStep'
import apis, { BaseUrl } from '../apis'
import useAuth from '../ahooks/useAuth'
import jwtDecode from 'jwt-decode'
import moment from 'moment'
import PolarChart from '../components/attendance/PolarChart'



const Dashboard = () => {
    const [showHistory, setShowHistory] = useState(true)
    const [isShowHistory, setIsShowHistory] = useState(true)
    const [showPolar, setshowPolar] = useState(false)
    const [isShowPolar, setIsShowPolar] = useState(false)

    const handleHistory = () => {
        !showHistory ?
            setShowHistory(true)
            :
            setShowHistory(false)
        setIsShowPolar(false)
        setIsShowHistory(true)
        setshowPolar(false)
    }
    const handlePolar = () => {
        !showPolar
            ?
            setshowPolar(true)
            :
            setshowPolar(false)

        setIsShowHistory(false)
        setIsShowPolar(true)
        setShowHistory(false)
    }

    const { auth } = useAuth()
    const [id, setId] = useState(null)
    const [data, setData] = useState(null)
    const [attend, setAttend] = useState([])
    const attends = attend?.data
    const user = data?.data
    const getId = id?.userId
    const [button, setButton] = useState([])
    const [showModal, setShowModal] = useState(false)
    const { coords, isGeolocationAvailable, isGeolocationEnabled, positionError } =
        useGeolocated({
            positionOptions: {
                enableHighAccuracy: false,
            },
            userDecisionTimeout: 5000,
        });

    const _toMap = () => {
        setShowModal(true)
    }



    useEffect(() => {
        const cekAttendance = async () => {
            const cek = await apis.get('api/cekAttendance', {
                headers: {
                    Authorization: `Bearer ${auth.token}`
                }
            })
            setButton(cek.data);
        }
        cekAttendance()
    }, [auth])

    let content;

    if (button.weekend) {
        content =
            <Button
                name='Clock In'
                // disabled
                onClick={_toMap}
                className={`bg-[#D9D9D9] text-white px-5 py-1 rounded`}
            />
    } else {
        if (button.clock_out && button.clock_in) {
            content =
                <Button
                    name='Clock Out'
                    disabled
                    className={`bg-[#D9D9D9] text-white px-5 py-1 rounded`}
                    onClick={_toMap}
                />

        } else
            if (button.clock_out) {
                content = <Button
                    name='Clock Out'
                    className={`bg-red-400 text-white px-5 py-1 rounded`}
                    onClick={_toMap}
                />
            }
            else
                if (button.clock_in) {
                    content = <Button
                        name='Clock In'
                        className={`bg-[#64B566] text-white px-5 py-1 rounded`}
                        onClick={_toMap}
                    />
                } else
                    if (button.permit || button.leave) {
                        content = <Button
                            name='Clock In'
                            disabled
                            className={`bg-[#D9D9D9] text-white px-5 py-1 rounded`}
                        />
                    }

    }

    const checkButton = () => {
        if (!isGeolocationAvailable) return <div>Your browser does not support Geolocation</div>;
        if (!isGeolocationEnabled) return <div>Geolocation is not enabled</div>;
        if (positionError) return <div>Something went wrong</div>;
        if (coords) return content
        return 'Error'
    };

    const map = <AttendanceStep closeModal={setShowModal} status={button} />

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
                setData(response.data)
            } catch (error) {
            }
        }
        getData()
    }, [auth, getId])

    useEffect(() => {
        const getAttend = async () => {
            try {
                const response = await apis.get('api/attendancebystaff', {
                    headers: {
                        Authorization: `Bearer ${auth.token}`
                    }
                })
                setAttend(response.data)
            } catch (error) {
                setAttend(error.response.data.message);
            }
        }
        getAttend()
    }, [auth])

    return (
        <>
            <div>
                {showModal && map}
            </div>
            <div>
                <div className='flex justify-between mb-4'>
                    <h1 className='text-[26px] font-bold text-[#3A5372]'>Dashboard</h1>
                    <div className='flex items-center mr-20 bg-gray-200 rounded'>
                        <button
                            className={`mx-2 ${isShowHistory ? 'underline' : ''}`}
                            onClick={handleHistory}
                            disabled={isShowHistory}
                        >
                            History
                        </button>
                        <button
                            className={`mx-2 ${isShowPolar ? 'underline' : ''}`}
                            onClick={handlePolar}
                            disabled={isShowPolar}
                        >
                            Chart
                        </button>
                    </div>
                </div>
                <div className='bg-white rounded-md mb-2 w-[92%] shadow-md' >
                    <div className='flex justify-between mx-10'>
                        <div className='flex flex-col justify-center items-center '>
                            {
                                data?.data.id_staff === undefined && data?.data.id_staff.photo === undefined ?
                                    < img
                                        className='w-[50px] h-[50px] rounded-md border-2 border-[#3A5372]'
                                        src={Photo}
                                        alt='avatar'
                                    />
                                    :
                                    < img
                                        className='w-[50px] h-[50px] rounded-[15px] border-2 border-[#3A5372]'
                                        src={`${BaseUrl}/${data?.data.id_staff.photo}`}
                                        alt='avatar'
                                    />
                            }
                        </div>
                        <div className='flex justify-center flex-col items-center h-[73px] text-[#3A5372] text-[17px] font-bold col-span-1'>
                            {user?.id_staff.name}
                        </div>
                        <div className='flex justify-center flex-col items-center h-[73px] text-[#3A5372] text-[17px]'>
                            <Moment interval={1000} format='dddd, DD-MM-YYYY' />
                        </div>
                        <div className='flex justify-center flex-col items-center h-[73px] text-[#3A5372] text-[17px]'>
                            <Moment interval={1000} format='hh:mm:ss' />
                        </div>
                        <div className='flex justify-center flex-col items-center h-[73px]text-[#3A5372] text-[17px]'>
                            {checkButton()}
                        </div>
                    </div>
                </div>

                <h1 className='ml-6 text-[26px] font-bold text-[#3A5372] mt-10 mb-2'>{isShowHistory ? "Attendance History" : "Attendance Performance"}</h1>
                <div className='ml-5'>
                    {
                        isShowHistory
                            ?
                            <div className={`overflow-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-[#F1F9F9] bg-white rounded-md mb-2 w-[90%] h-[300px] px-10 py-2 shadow-md`} >
                                {attends ? attends.slice(0).reverse().map((item, index) => (
                                    <Fragment key={index}>
                                        {
                                            item.clock_out ?
                                                <p className='text-[18px] text-[#3A5372] py-2 ml-[22px]'>
                                                    You had clocked out on {moment(item.date).format('dddd, DD MMM YYYY')} at {moment(item.clock_out).format('LT')}
                                                </p>
                                                : ''
                                        }
                                        {
                                            item.clock_in === null
                                                ?
                                                null
                                                :
                                                <p className='text-[18px] text-[#3A5372] py-2 ml-[22px]'>
                                                    You had clocked in on {moment(item.date).format('dddd, DD MMM YYYY')} at {moment(item.clock_in).format('LT')}
                                                </p>
                                        }
                                    </Fragment>
                                )) :
                                    <div className='flex justify-center items-center h-full'>
                                        {attend.message}
                                    </div>
                                }
                            </div>
                            :
                            <div className='flex w-[90%] justify-around'>
                                <PolarChart />
                            </div>
                    }
                </div>


            </div>
        </>
    )
}


export default Dashboard