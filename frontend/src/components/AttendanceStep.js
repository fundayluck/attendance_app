import { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import ToFaceCam from './ToFaceCam'
import ToMap from './ToMap'
import Button from './common/Button'
import Swal from 'sweetalert2'
import apis from '../apis'
import useAuth from '../ahooks/useAuth'

const AttendanceStep = ({ closeModal, status }) => {
    const { auth } = useAuth()
    const [stepOne, setStepOne] = useState(false)
    const [sendAttend, setSendAttend] = useState(false)
    const [data, setData] = useState({
        latitude: null,
        longitude: null,
        image: null,
    })

    const getAttendIn = async () => {
        try {
            const formData = new FormData()
            formData.append("latitude", data.latitude)
            formData.append("longitude", data.longitude)
            formData.append("image", data.image)
            await apis.post(
                'api/attendance/clock_in',
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${auth?.token}`,
                    },
                }
            )
            closeModal(false)
            window.location.reload()
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: "you have successfully clocked in!",
                showConfirmButton: false,
            })
        } catch (error) {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: error.response.data.message,
                showConfirmButton: false,
            })
        }
    }

    const getAttendOut = async () => {
        try {
            const formData = new FormData()
            formData.append("image", data.image)
            await apis.post('api/attendance/clock_out',
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${auth?.token}`,
                    },
                }
            )
            closeModal(false)
            window.location.reload()
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: "you have successfully clocked out!",
                showConfirmButton: false,
            })
        } catch (error) {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: error.response.data.message,
                showConfirmButton: false,
            })
        }
    }

    useEffect(() => {
        document.body.classList.add('overflow-hidden')

        return () => {
            document.body.classList.remove('overflow-hidden')
        }
    }, [])


    let renderContent;

    if (!stepOne) {
        renderContent = <ToMap data={data} setData={setData} />
    } else if (stepOne) {
        renderContent = <ToFaceCam data={data} setData={setData} />
    }

    const handleNext = async () => {
        if (data.latitude === null && data.longitude === null)
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: "Confirm your location first!",
                showConfirmButton: true,
            })
        else {
            setStepOne(true)
            setSendAttend(true)
            if (sendAttend === true) {
                if (data.image === null)
                    Swal.fire({
                        position: 'center',
                        icon: 'warning',
                        title: "take a selfie first!",
                        showConfirmButton: true,
                    })
                else {
                    closeModal(false)
                    if (status.clock_out) {
                        await getAttendOut()
                    } else {
                        await getAttendIn()
                    }
                }
            }
        }
    }

    const handleBack = () => {
        if (stepOne === false) {
            closeModal(false)
        }
        setStepOne(false)
    }

    return ReactDOM.createPortal(
        <div className='flex justify-center'>
            <div className="fixed inset-0 bg-gray-300 opacity-80"></div>
            <div className='fixed inset-40 top-10 p-2'>
                <div className='flex justify-center items-center'>
                    {renderContent}
                </div>
                <div className='p-2 flex justify-center items-center'>
                    <Button onClick={handleBack} name='back' className='bg-blue-500 text-white py-2 px-4 mr-1 rounded' />
                    <Button onClick={handleNext} name={stepOne ? 'send' : 'next'} className='bg-blue-500 text-white py-2 px-4 mr-1 rounded' />
                </div>
            </div>
        </div>,
        document.querySelector('.modal-container')
    )
}

export default AttendanceStep