import { Fragment, useState } from 'react'
import Staff from '../components/people/Staff'
import Users from '../components/people/Users'

const People = () => {
    const [showStaff, setShowStaff] = useState(true)
    const [isShowStaff, setIsShowStaff] = useState(true)
    const [showUsers, setshowUsers] = useState(false)
    const [isShowUsers, setIsShowUsers] = useState(false)

    const handleStaff = () => {
        !showStaff ?
            setShowStaff(true)
            :
            setShowStaff(false)
        setIsShowUsers(false)
        setIsShowStaff(true)
        setshowUsers(false)
    }
    const handleUsers = () => {
        !showUsers
            ?
            setshowUsers(true)
            :
            setshowUsers(false)

        setIsShowStaff(false)
        setIsShowUsers(true)
        setShowStaff(false)
    }

    return (
        <>
            <div className='fixed bg-[#F1F9F9] mt-[-4px] w-[75%]'>
                <div className='flex justify-between'>
                    <h1 className='text-[26px] font-bold text-[#3A5372]'>People</h1>
                    <div className='flex items-center mr-20 bg-gray-200 rounded'>
                        <button
                            className={`mx-2 ${isShowStaff ? 'underline' : ''}`}
                            onClick={handleStaff}
                            disabled={isShowStaff}
                        >
                            Users
                        </button>
                        <button
                            className={`mx-2 ${isShowUsers ? 'underline' : ''}`}
                            onClick={handleUsers}
                            disabled={isShowUsers}
                        >
                            Staff
                        </button>
                    </div>
                </div>
            </div>
            <Fragment>
                <Staff show={showStaff} />
            </Fragment>
            <Fragment>
                <Users show={showUsers} />
            </Fragment>

        </>
    )
}

export default People