import { useEffect, useState } from 'react'
import Headbar from './Headbar'
import Sidebar from './Sidebar'

import { Outlet } from 'react-router-dom'
import useAuth from '../ahooks/useAuth';
import jwtDecode from 'jwt-decode';
import Swal from 'sweetalert2';
import apis from '../apis';


const Layout = () => {
    const { auth, setAuth } = useAuth()
    const [id, setId] = useState(null)
    const [data, setData] = useState(null)
    const getId = id?.userId

    useEffect(() => {
        const getUser = async () => {
            try {
                const decode = await jwtDecode(JSON.stringify(auth))
                setId(decode)
                if (decode.exp * 1000 < Date.now()) {
                    localStorage.removeItem('auth')
                    setAuth({
                        status: false,
                        token: null
                    })
                    Swal.fire({
                        position: 'center',
                        icon: 'info',
                        title: 'Your token has expired, please login again!',
                        showConfirmButton: true,
                    })

                }
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
    }, [auth, setAuth, getId])

    return (
        <div>
            <Headbar
                data={data}
            />
            <Sidebar />
            <div className='ml-[300px] pt-[60px] mx-4'>
                <Outlet />
            </div>
        </div>
    )
}


export default Layout