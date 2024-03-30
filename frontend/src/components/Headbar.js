import { useState } from 'react'
import Photo from '../assets/images/photo.jpg'
import { BaseUrl } from '../apis';
import Menu from './Menu';

const Headbar = ({ data }) => {
    const [showModal, setShowModal] = useState(false)

    const modal = <Menu setShowModal={setShowModal} />

    return (
        <>
            {showModal && modal}
            <nav className="bg-[#F1F9F9] border-gray-200 px-2  fixed w-full">
                <div className="container flex flex-wrap items-center justify-between mx-auto">
                    <a href="https://flowbite.com/" className="flex items-center">
                        <img src="https://flowbite.com/docs/images/logo.svg" className="h-6 mr-3 sm:h-9" alt="" />
                        <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white"></span>
                    </a>
                    <button onClick={() => setShowModal(true)} type="button" className="inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg " aria-controls="navbar-default" aria-expanded="false">
                        {data?.data.id_staff === undefined && data?.data.id_staff.photo === undefined ?
                            < img
                                className='w-10 h-10 rounded outline-0'
                                src={Photo}
                                alt='avatar'
                            />
                            :
                            < img
                                className='w-10 h-10 rounded outline-0'
                                src={
                                    data?.data.id_staff !== null
                                        ? `${BaseUrl}/${data?.data.id_staff.photo}`
                                        : Photo
                                }
                                alt='avatar'
                            />
                        }
                    </button>
                </div>
            </nav>
        </>
    )
}

export default Headbar