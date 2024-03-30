import { useEffect, useState } from 'react'
import apis from '../apis'
import useAuth from '../ahooks/useAuth'
import { ImSpinner2 } from 'react-icons/im'
import Button from '../components/common/Button'
import Swal from 'sweetalert2'

const Config = () => {
    const { auth } = useAuth()
    const [isLoading, setIsLoading] = useState(false)
    const [start, setStart] = useState('')
    const [end, setEnd] = useState('')
    const [late, setLate] = useState('')


    const doEdit = async (event) => {
        event.preventDefault()
        try {
            setIsLoading(true)
            await apis('api/edit-config', {
                headers: {
                    Authorization: `Bearer ${auth.token}`
                },
                method: "PUT",
                data: {
                    start_working: start,
                    finish_working: end,
                    late: late
                },
            })
            setIsLoading(false)
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Edited Config Success!',
                showConfirmButton: true,
            })
        } catch (error) {
            setIsLoading(false)
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: error.response.data.message,
                showConfirmButton: true,
            })
        }
    }

    useEffect(() => {
        const fetch = async () => {
            try {
                const response = await apis.get('api/config', {
                    headers: {
                        Authorization: `Bearer ${auth.token}`
                    }
                })
                setStart(response.data.data[0].start_working)
                setEnd(response.data.data[0].finish_working)
                setLate(response.data.data[0].late)

            } catch (error) {
                console.log(error);
            }
        }
        fetch()
    }, [auth])

    return (
        <div>
            <div className='flex justify-between mb-4'>
                <h1 className='text-[26px] font-bold text-[#3A5372]'>Configuration</h1>
            </div>
            <form onSubmit={doEdit}>
                <div className='grid grid-cols-1 md:grid-cols-2'>
                    <div className='flex flex-col'>
                        <label className='text-[18px] text-[#3A5372] font-bold pl-1'>Start Time</label>
                        <input
                            type='time'
                            className='bg-[#F1F9F9] border-b-2 w-[320px] px-2 my-2 outline-0 leading-loose'
                            placeholder='Start Time'
                            value={start}
                            onChange={(e) => setStart(e.target.value + ":00")}
                        />
                    </div>
                    <div className='flex flex-col'>
                        <label className='text-[18px] text-[#3A5372] font-bold pl-1'>End Time</label>
                        <input
                            type='time'
                            className='bg-[#F1F9F9] border-b-2 w-[320px] px-2 my-2 outline-0 leading-loose'
                            placeholder='End Time'
                            value={end}
                            onChange={(e) => setEnd(e.target.value + ":00")}
                        />
                    </div>
                    <div className='flex flex-col'>
                        <label className='text-[18px] text-[#3A5372] font-bold pl-1'>Late Time</label>
                        <input
                            type='time'
                            className='bg-[#F1F9F9] border-b-2 w-[320px] px-2 my-2 outline-0 leading-loose'
                            placeholder='Late Time'
                            value={late}
                            onChange={(e) => setLate(e.target.value + ":00")}
                        />
                    </div>
                </div>
                <Button
                    name={
                        isLoading ? <ImSpinner2 className='animate-spin' /> :
                            'Edit'
                    }
                    disabled={isLoading ? true : false}
                    type='submit'
                    className='bg-[#F6E7E6] h-[40px] px-2 py-1 rounded-md tracking-wider text-[17px] text-[#3A5372] shadow hover:shadow-md mr-2'
                />
            </form>
        </div>
    )
}

export default Config