import { useEffect, useState } from 'react'
import apis, { BaseUrl } from '../../apis'
import useAuth from '../../ahooks/useAuth'
import { NavLink } from 'react-router-dom'
import { ImSpinner2 } from 'react-icons/im'
import { BiArrowBack } from 'react-icons/bi'

const AddUser = () => {
    const { auth } = useAuth()
    const [isLoading, setIsLoading] = useState(false)
    const [nip, setNip] = useState([])

    const [error, setError] = useState([])
    const Nips = nip?.data

    useEffect(() => {
        const getNip = async () => {
            try {
                setIsLoading(true)
                const response = await apis.get('/api/nip', {
                    headers: {
                        authorization: `Bearer ${auth.token}`
                    }
                })
                setNip(response.data)
                setIsLoading(false)
            } catch (error) {
                setError(error.response.data)
                setIsLoading(false)
            }
        }
        getNip()
    }, [auth])

    let content
    if (isLoading === true) {
        content = <div className='fixed w-[75%] flex flex-col justify-center items-center h-[500px]'>
            <h1 className='text-[20px] font-bold'><ImSpinner2 className='animate-spin' /></h1>
        </div>
    } else
        if (nip.status === true) {
            content =
                Nips.map((user) => (
                    <NavLink key={user._id} to={`create/${user._id}`} className='hover:shadow-xl'>
                        <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow-md ">
                            <div className="flex flex-col items-center py-5">
                                <img className="w-24 h-24 mb-3 rounded-full shadow-lg" src={`${BaseUrl}/${user?.photo}`} alt={user?.name} />
                                <h5 className="mb-1 text-xl font-medium text-gray-900 ">{user?._id}</h5>
                                <h5 className="mb-1 text-xl font-medium text-gray-900 ">{user?.name}</h5>
                                <span className="text-sm text-gray-500">{user?.id_division.name}</span>
                            </div>
                        </div>
                    </NavLink>
                ))

        } else
            if (error.status === false) {
                content = <div className='flex flex-col justify-center items-center h-[500px]'>
                    <h1 className='text-[20px] font-bold'>{error.data}</h1>
                </div>
            }

    return (
        <div className='flex flex-col'>
            <div className='flex items-center mb-2'>
                <NavLink to='/people' className='hover:bg-gray-200 mr-4'>
                    <BiArrowBack className='text-[25px] font-bold' />
                </NavLink>
                <h1 className='text-[26px] font-bold text-[#3A5372]'>Create Account</h1>
            </div>
            <div className={nip.length === 0 ? '' : 'grid grid-cols-5 gap-2'}>
                {content}
            </div>
        </div>
    )
}

export default AddUser