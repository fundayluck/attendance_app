import { useState, useEffect } from 'react'
import { BiArrowBack } from 'react-icons/bi'
import { Link, NavLink, useNavigate, useParams } from 'react-router-dom'
import useAuth from '../../ahooks/useAuth'
import apis, { BaseUrl } from '../../apis'
import moment from 'moment'
import Button from '../common/Button'
import Swal from 'sweetalert2'
import { ImSpinner2 } from 'react-icons/im'

const DetailAccess = () => {
    const { auth } = useAuth()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const idPermit = useParams()
    const [permit, setPermit] = useState([])
    const [noteHR, setNoteHR] = useState('')
    const data = permit

    useEffect(() => {
        const getPermit = async () => {
            const response = await apis.get(`/api/permit/access/${idPermit.id}`, {
                headers: {
                    authorization: `Bearer ${auth.token}`
                }
            })
            setPermit(response.data.data[0]);
        }
        getPermit()
    }, [auth, idPermit])

    const doReject = async () => {
        try {
            setLoading(true)
            await apis(`api/permit/${idPermit.id}`, {
                headers: {
                    Authorization: `Bearer ${auth?.token}`,
                },
                method: "PUT",
                data: {
                    notes_hr: noteHR,
                    is_accepted: 0
                }
            })
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Thanks for the response!',
                showConfirmButton: true,
            })
            setLoading(false)
            navigate('/access')
        } catch (error) {
            setLoading(false)
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: error.response.data.message,
                showConfirmButton: true,
            })
            navigate('/access')
        }
    }
    const doApprove = async () => {
        try {
            setLoading(true)
            await apis(`api/permit/${idPermit.id}`, {
                headers: {
                    Authorization: `Bearer ${auth?.token}`,
                },
                method: "PUT",
                data: {
                    notes_hr: noteHR,
                    is_accepted: 1
                }
            })
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Thanks for the response!',
                showConfirmButton: true,
            })
            setLoading(false)
            navigate('/access')
        } catch (error) {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: error.response.data.message,
                showConfirmButton: true,
            })
            setLoading(false)
            navigate('/access')
        }
    }

    return (
        <>
            <div className='flex items-center mb-4'>
                <NavLink to='/access' className='hover:bg-gray-200 mr-4'>
                    <BiArrowBack className='text-[25px] font-bold' />
                </NavLink>
                <h1 className='text-[26px] font-bold text-[#3A5372]'>Detail Access Request</h1>
            </div>
            <div className='bg-white w-full h-[400px] flex flex-col justify-center rounded-md border border-black' >
                <div className='flex justify-center mb-5'>
                    <h1 className='font-bold text-[#3A5372] text-[18px]'>Request For</h1>
                </div>
                <div className='grid grid-cols-3 ' >
                    <div className='flex flex-col w-full'>
                        <label className='ml-2'>Employee Name</label>
                        <input
                            type='text'
                            disabled
                            value={data?.id_staff?.id_staff?.name || ''}
                            readOnly
                            className='border border-black w-[279px] h-[35px]  m-2 p-2'
                        />
                    </div>
                    <div className='flex flex-col w-full'>
                        <label className='ml-2'>Position</label>
                        <input
                            type='text'
                            disabled
                            value={data?.id_staff?.id_staff?.id_division?.name || ''}
                            readOnly
                            className='border border-black w-[279px] h-[35px]  m-2 p-2'
                        />
                    </div>
                    <div className='flex flex-col w-full'>
                        <label className='ml-2'>Start Date</label>
                        <input required placeholder='Start Date' type='date'
                            disabled
                            value={moment(data.start_date).format('YYYY-MM-DD')}
                            readOnly
                            className='border border-black w-[279px] h-[35px]  m-2 p-2' />
                    </div>
                    <div className='flex flex-col w-full'>
                        <label className='ml-2'>End Date</label>
                        <input required placeholder='End Date' type='date'
                            disabled
                            value={moment(data.end_date).format('YYYY-MM-DD')}
                            readOnly
                            className='border border-black w-[279px] h-[35px]   m-2 p-2' />
                    </div>
                    <div className='flex flex-col w-full'>
                        <label className='ml-2'>Proof</label>
                        {data.proof !== null
                            ?
                            <Link to={`${BaseUrl}/${data.proof}`} target='_black'>
                                <div className="group flex relative">
                                    <textarea className='border border-black w-[279px] h-[35px] m-2 p-1'
                                        value={data.proof !== null ? data?.proof?.slice(6) : "tidak Mengupload file"}
                                        readOnly
                                        disabled
                                    />
                                    <span className="group-hover:opacity-100 transition-opacity bg-gray-800 px-1 text-sm text-gray-100 rounded-md absolute left-1/2 
    -translate-x-1/2 translate-y-full opacity-0 m-4 mx-auto">klik untuk melihat</span>
                                </div>
                            </Link>
                            :
                            <div className="group flex relative">
                                <textarea className='border border-black w-[279px] h-[35px] m-2 p-1'
                                    value={data.proof !== null ? data?.proof?.slice(6) : "tidak Mengupload file"}
                                    readOnly
                                    disabled
                                />
                            </div>
                        }
                    </div>
                    <div className='flex flex-col w-full'>
                        <label className='ml-2'>Status</label>
                        <select
                            value={data.status}
                            aria-readonly
                            className='border border-black w-[279px] h-[35px]  m-2'
                            disabled
                        >
                            <option value='Permit'>Permit</option>
                            <option value='Leave'>Leave</option>
                        </select>
                    </div>
                    <div className='flex flex-col w-full'>
                        <label className='ml-2'>Note</label>
                        <textarea
                            disabled
                            value={data.note !== null ? data.note : 'tidak memberikan catatan'}
                            readOnly
                            className='border border-black w-[279px] h-[100px]  m-2 p-2'
                        />
                    </div>
                    <div className='flex flex-col w-full'>
                        <label className='ml-2'>Note</label>
                        <textarea
                            type='text'
                            value={
                                data.is_accepted === null ?
                                    noteHR
                                    :
                                    data.notes_hr
                            }
                            onChange={(e) => setNoteHR(e.target.value)}
                            readOnly={data.is_accepted !== null ? true : false}
                            disabled={data.is_accepted !== null ? true : false}
                            className='border border-black w-[279px] h-[100px]  m-2 p-2'
                        />
                    </div>
                    {data.is_accepted === 1 || data.is_accepted === 0 ?
                        null
                        :
                        <div className='p-2 flex justify-center items-center'>
                            <Button onClick={doReject} name={loading ? <ImSpinner2 className='animate-spin' /> : 'Reject'} className='bg-[#FFFFFF] border border-black text-[#3A5372] py-1 px-4 mr-1 rounded' />
                            <Button onClick={doApprove} name={loading ? <ImSpinner2 className='animate-spin' /> : 'Approve'} className='bg-[#FFFFFF] border border-black text-[#3A5372] py-1 px-4 mr-1 rounded' />
                        </div>
                    }

                </div>
            </div>
        </>
    )
}

export default DetailAccess