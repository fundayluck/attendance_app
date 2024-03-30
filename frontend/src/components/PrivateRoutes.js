import { Navigate, Outlet } from 'react-router-dom'
import useAuth from '../ahooks/useAuth';

const PrivateRoutes = () => {
    const { auth } = useAuth()

    return auth?.status === true ? <Outlet /> : <Navigate to='/login' />
}

export default PrivateRoutes