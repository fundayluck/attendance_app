import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import Button from '../common/Button'
import { ImSpinner2 } from 'react-icons/im'
import useAuth from '../../ahooks/useAuth'
import apis from '../../apis'
import moment from 'moment'
import Swal from 'sweetalert2'



const FormAccess = ({ setShowModal, idPermit, setIdPermit }) => {
    const { auth } = useAuth()
    const [loading, setLoading] = useState(false)
    const [noteHR, setNoteHR] = useState('')
    const [permit, setPermit] = useState([])
    const data = permit

    useEffect(() => {
        const getPermit = async () => {
            const response = await apis.get(`/api/permit/access/${idPermit}`, {
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
            await apis(`api/permit/${idPermit}`, {
                headers: {
                    Authorization: `Bearer ${auth?.token}`,
                },
                method: "PUT",
                data: {
                    notes_hr: noteHR,
                    is_accepted: 0
                }
            })
            window.location.reload()
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Thanks for the response!',
                showConfirmButton: true,
            })
            setShowModal(false)
            setLoading(false)
        } catch (error) {
            setLoading(false)
            setShowModal(false)
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: error.response.data.message,
                showConfirmButton: true,
            })
        }
    }
    const doApprove = async () => {
        try {
            setLoading(true)
            await apis(`api/permit/${idPermit}`, {
                headers: {
                    Authorization: `Bearer ${auth?.token}`,
                },
                method: "PUT",
                data: {
                    notes_hr: noteHR,
                    is_accepted: 1
                }
            })
            window.location.reload()
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Thanks for the response!',
                showConfirmButton: true,
            })
            setShowModal(false)
            setLoading(false)
        } catch (error) {
            setLoading(false)
            setShowModal(false)
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: error.response.data.message,
                showConfirmButton: true,
            })
        }
    }


    return ReactDOM.createPortal(
        <div className='flex justify-center'>
            <div className="fixed inset-0 bg-gray-300 opacity-80"></div>
            <div className={`fixed flex justify-center inset-40 top-[100px] p-2 rounded`}>
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
                            <textarea htmlFor='files' className='border border-black w-[279px] h-[35px] m-2 p-1'>{data.proof !== null ? data?.proof : "tidak Mengupload file"}</textarea>
                            <input id='files' placeholder='Proof' type='file'
                                // onChange={uploadFile} 
                                className='hidden'
                                disabled />
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
                                value={data.note}
                                readOnly
                                className='border border-black w-[279px] h-[100px]  m-2 p-2'
                            />
                        </div>
                        <div className='flex flex-col w-full'>
                            <label className='ml-2'>Note</label>
                            <textarea
                                type='text'
                                value={noteHR}
                                onChange={e => setNoteHR(e.target.value)}
                                className='border border-black w-[279px] h-[100px]  m-2 p-2'
                            />
                        </div>
                    </div>
                    <div className='p-2 flex justify-center items-center'>
                        <Button name='back' onClick={() => {
                            setShowModal(false)
                            setIdPermit('')
                        }} className='bg-[#3A5372] text-white py-1 px-4 mr-1 rounded' />
                        <Button onClick={doReject} name={loading ? <ImSpinner2 className='animate-spin' /> : 'Reject'} className='bg-[#FFFFFF] border border-black text-[#3A5372] py-1 px-4 mr-1 rounded' />
                        <Button onClick={doApprove} name={loading ? <ImSpinner2 className='animate-spin' /> : 'Approve'} className='bg-[#FFFFFF] border border-black text-[#3A5372] py-1 px-4 mr-1 rounded' />
                    </div>
                </div>
            </div>
        </div>,
        document.querySelector('.modal-container')
    )
}

export default FormAccess