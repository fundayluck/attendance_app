import React, { useEffect, useState } from 'react'
import useAuth from '../../ahooks/useAuth';
import apis, { BaseUrl } from '../../apis';
import Chart from "react-apexcharts";
import Photo from '../../assets/images/photo.jpg'
import { AiFillStar } from 'react-icons/ai'
import { ImSpinner2 } from 'react-icons/im';

const PolarChart = () => {
    const { auth } = useAuth()
    const [dt, setDt] = useState([])
    const [data, setData] = useState([])
    const item = data?.data
    const [errMessage, setErrMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const getId = auth?.user?.id
    useEffect(() => {
        const getData = async () => {
            try {
                const response = await apis.get(`api/chart/${getId}`, {
                    headers: {
                        Authorization: `Bearer ${auth.token}`
                    }
                })
                setDt(response.data);
            } catch (error) {
                console.log(error);
            }
        }
        getData()
        const fetch = async () => {
            setLoading(true)
            try {
                const response = await apis.get('api/ratingsbystaff', {
                    headers: {
                        Authorization: `Bearer ${auth.token}`
                    }
                })
                setData(response);
                setLoading(false)
            } catch (error) {
                setLoading(false)
                setErrMessage(error.response.data.message)
            }
        }
        fetch()
    }, [auth, getId])

    const options = {
        chartOptions: {
            labels: ['Attend', 'Late', 'Permit', 'Leave', 'Alpha']
        },
        series: [dt.attend, dt.late, dt.permit, dt.leave, dt.alpha],
        // series: [12, 1, 1, 1, 2],

    }


    return (
        <>
            {
                errMessage !== '' ?
                    <div className='flex flex-col justify-center  bg-white w-[100%] rounded-md ml-[-30px] mr-[10px] shadow-md'>
                        <div className='p-4 h-[73px] text-[#3A5372] tracking-wide flex justify-center text-[17px]'>{errMessage}</div>
                    </div>
                    :
                    loading ?
                        <div className='flex flex-col justify-center  bg-white w-[100%] rounded-md ml-[-30px] mr-[10px] shadow-md'>
                            <div className='p-4 h-[73px] text-[#3A5372] tracking-wide flex justify-center text-[17px]'><ImSpinner2 className='animate-spin' size={25} /></div>
                        </div>
                        :
                        <div className='bg-white w-[50%] h-[300px] rounded-md mr-2 shadow-md'>
                            <div className='flex justify-center items-center p-2'>
                                {item?.user[0]?.id_staff?.photo === undefined ?
                                    < img
                                        className='w-10 h-10 rounded outline-0'
                                        src={Photo}
                                        alt='avatar'
                                    />
                                    :
                                    < img
                                        className='w-[150px] h-[150px] rounded-full border-2'
                                        src={`${BaseUrl}/${item?.user[0]?.id_staff?.photo}`}
                                        alt='avatar'
                                    />
                                }
                            </div>
                            <div className='flex flex-col items-center justify-center mb-4'>
                                <div className='text-[#3A5372] text-sm font-bold'>{item?.user[0]?.id_staff?.name}</div>
                                <div className='text-[#3A5372] text-sm'>{item?.user[0]?.id_staff?.id_division?.name}</div>
                            </div>
                            <div className='flex justify-center text-center font-bold flex-col items-center text-[#3A5372] italic text-sm mb-2'>
                                "{`${item?.message}`}"
                            </div>
                            <div className='flex justify-center flex-row items-center text-[#3A5372] text-xl'>
                                {item?.persentage <= 20 ?
                                    <AiFillStar color='orange' />
                                    :
                                    item?.persentage <= 40 ?
                                        <>
                                            <AiFillStar color='orange' />
                                            <AiFillStar color='orange' />
                                        </>
                                        :
                                        item?.persentage <= 60 ?
                                            <>
                                                <AiFillStar color='orange' />
                                                <AiFillStar color='orange' />
                                                <AiFillStar color='orange' />
                                            </>
                                            :
                                            item?.persentage <= 80 ?
                                                <>
                                                    <AiFillStar color='orange' />
                                                    <AiFillStar color='orange' />
                                                    <AiFillStar color='orange' />
                                                    <AiFillStar color='orange' />
                                                </>
                                                :
                                                item?.persentage <= 100 ?
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
                        </div >
            }
            <div className='flex items-center bg-white w-[50%] h-[300px] rounded-md shadow-md'>
                <Chart
                    options={options.chartOptions}
                    series={options.series}
                    type='donut'
                    width={400}
                    height={400}
                />
            </div>
        </>
    )
}


export default PolarChart