import ReactDOM from 'react-dom'
import { NavLink, useNavigate } from 'react-router-dom'
import useAuth from '../ahooks/useAuth'
import { AiTwotoneSetting } from 'react-icons/ai'
import { TbLogout } from 'react-icons/tb'


const Menu = ({ setShowModal }) => {
    const { setAuth } = useAuth()
    const navigate = useNavigate()
    const handleLogout = () => {
        setAuth({
            status: false,
            token: null
        })
        navigate('/')
    }

    return ReactDOM.createPortal(
        <div className='flex justify-center'>
            <div className="fixed inset-0 bg-gray-300 opacity-80" onClick={() => setShowModal(false)}></div>
            <div className={`fixed flex justify-center items-center border-1 inset-60 border-black`}>
                <div className={`bg-white rounded-md border border-black `}>
                    <NavLink
                        to='/detail-user'
                        onClick={() => setShowModal(false)}
                        className="flex items-center block px-4 py-2  text-sm text-gray-500 rounded-lg  hover:text-gray-700"
                    >
                        <AiTwotoneSetting className='mr-2' />  Account Setting
                    </NavLink>
                    <NavLink
                        onClick={() => {
                            handleLogout()
                            setShowModal(false)
                        }}
                        className="flex items-center block px-4 py-2  text-sm text-gray-500 rounded-lg hover:text-gray-700"
                    >
                        <TbLogout className='mr-2' />  Logout
                    </NavLink>
                </div>
            </div>
        </div>,
        document.querySelector('.modal-container')
    )
}

export default Menu