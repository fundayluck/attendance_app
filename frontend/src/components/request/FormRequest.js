import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import Button from '../common/Button'
import { ImSpinner2 } from 'react-icons/im'
import apis from '../../apis'
import useAuth from '../../ahooks/useAuth'
import Swal from 'sweetalert2'
import moment from 'moment'


const FormRequest = ({ setShowModal }) => {
    const { auth } = useAuth()
    const [start, setStart] = useState('')
    const [end, setEnd] = useState('')
    const [note, setNote] = useState('')
    const [proof, setProof] = useState(null)
    const [status, setStatus] = useState("Permit")
    const [loading, setLoading] = useState(false)

    const uploadFile = (event) => {
        setProof(event.target.files[0])
    }

    const SendRequest = async (event) => {
        event.preventDefault()
        try {
            setLoading(true)
            const formData = new FormData()
            formData.append("status", status)
            formData.append("start_date", start)
            formData.append("end_date", end)
            formData.append("image", proof)
            formData.append("note", note)

            const response = await apis.post(
                'api/permit',
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${auth.token}`
                    }
                }
            )
            if (response.data.status === true) {
                setLoading(false)
                setShowModal(false)
                window.location.reload()
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Success Send Request!',
                    showConfirmButton: true,
                })
            }
        } catch (error) {
            setLoading(false)
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: error.response.data.message,
                showConfirmButton: false,
            })
        }

    }

    let today = moment().format('YYYY-MM-DD')

    return ReactDOM.createPortal(
        <div className='flex justify-center'>
            <div className="fixed inset-0 bg-gray-300 opacity-80"></div>
            <div className={`fixed flex justify-center inset-40 top-[100px] p-2 rounded`}>
                <form className='bg-white flex flex-col justify-center rounded-md border border-black' onSubmit={SendRequest}>
                    <div className='flex justify-center mb-5'>
                        <h1 className='font-bold text-[#3A5372] text-[18px]'>Request For</h1>
                    </div>
                    <div className='grid grid-cols-2 mx-20' >
                        <div className='flex flex-col w-full'>
                            <label className='ml-2'>Start Date</label>
                            <input required placeholder='Start Date' type='date' min={today} value={start} onChange={(e) => setStart(e.target.value)} className='border border-black w-[279px] h-[35px]  m-2 p-2' />
                        </div>
                        <div className='flex flex-col w-full'>
                            <label className='ml-2'>End Date</label>
                            <input required placeholder='End Date' type='date' min={start} value={end} onChange={(e) => setEnd(e.target.value)} className='border border-black w-[279px] h-[35px]   m-2 p-2' />
                        </div>
                        <div className='flex flex-col w-full'>
                            <label className='ml-2'>Note</label>
                            <input required placeholder='Note' type='text' value={note} onChange={(e) => setNote(e.target.value)} className='border border-black w-[279px] h-[35px]   m-2 p-2' />
                        </div>
                        <div className='flex flex-col w-full'>
                            <label className='ml-2'>Proof</label>
                            <label htmlFor='files' className='border border-black w-[279px] h-[35px] m-2 p-1 cursor-pointer'>{proof !== null ? proof.name : "Upload Your Proof"}</label>
                            <input id='files' placeholder='Proof' type='file' onChange={uploadFile} className='hidden' />
                        </div>
                        <div className='flex flex-col w-full'>
                            <label className='ml-2'>Status</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className='border border-black w-[279px] h-[35px]  m-2'
                            >
                                <option value='Permit'>Permit</option>
                                <option value='Leave'>Leave</option>
                            </select>
                        </div>

                    </div>
                    <div className='p-2 flex justify-center items-center'>
                        <Button name='back' onClick={() => setShowModal(false)} className='bg-[#3A5372] text-white py-1 px-4 mr-1 rounded' />
                        <Button type='submit' name={loading ? <ImSpinner2 className='animate-spin' /> : 'Send'} className='bg-[#FFFFFF] border border-black text-[#3A5372] py-1 px-4 mr-1 rounded' />
                    </div>
                </form>
            </div>
        </div>,
        document.querySelector('.modal-container')
    )
}

export default FormRequest