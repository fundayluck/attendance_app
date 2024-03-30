import React, { useEffect, useState } from 'react'
import Logo from '../../assets/logo/Logo.png'
import apis from '../../apis'
import useAuth from '../../ahooks/useAuth'
import { useParams } from 'react-router-dom'

const Report = () => {
    const params = useParams()
    console.log(params?.date);
    const { auth } = useAuth()
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        const getData = async () => {
            setLoading(true)
            try {
                const response = await apis.get(`api/report`, {
                    headers: {
                        Authorization: `Bearer ${auth.token}`
                    },
                    params: {
                        date: params?.date !== "null" ? params?.date : ''
                    }
                })
                setData(response.data);
                setLoading(false)
            } catch (error) {
                console.log(error);
                // setLoading(false)
            }
        }
        getData()
    }, [auth, params])

    return (
        <>
            <div className='flex flex-col justify-center items-center'>
                <img
                    src={Logo}
                    alt='Logo'
                    width={200}
                    height={200}
                    className='items-center'
                />
                <h1 className='font-bold'>PT KAYA RAYA TURUN TEMURUN</h1>
                <h1 className='font-bold'>Report Attendance</h1>
            </div>
            <div className='p-5'>
                <table className='w-full border-collapse border border-solid'>
                    <thead className='bg-[#991F5D]'>
                        <tr>
                            <th className='p-2 text-white'>NIP</th>
                            <th className='p-2 text-white'>Name</th>
                            <th className='p-2 text-white'>Division</th>
                            <th className='p-2 text-white'>Area</th>
                            <th className='p-2 text-white'>Attend</th>
                            <th className='p-2 text-white'>Late</th>
                            <th className='p-2 text-white'>Permit</th>
                            <th className='p-2 text-white'>Leave</th>
                            <th className='p-2 text-white'>Alpha</th>
                        </tr>
                    </thead>
                    {loading ?
                        <tr >
                            <td colSpan='9' className='p-2 text-center'>
                                Please Wait
                            </td>
                        </tr>
                        :
                        <tbody className='bg-gray odd:bg-[#DDDDDD]'>
                            {data.map((user, index) =>
                                <tr key={index}>
                                    <td className='p-2 text-center'>{index + 1}</td>
                                    <td className='p-2 text-center'>{user?.staff?.id_staff?.name}</td>
                                    <td className='p-2 text-center'>{user?.staff?.id_staff?.id_division?.name}</td>
                                    <td className='p-2 text-center'>{user?.staff?.id_staff?.area}</td>
                                    <td className='p-2 text-center'>{user?.attend}</td>
                                    <td className='p-2 text-center'>{user?.late}</td>
                                    <td className='p-2 text-center'>{user?.permit}</td>
                                    <td className='p-2 text-center'>{user?.leave}</td>
                                    <td className='p-2 text-center'>{user?.alpha}</td>
                                </tr>
                            )}
                        </tbody>
                    }
                </table>
            </div>
        </>
    )
}

export default Report