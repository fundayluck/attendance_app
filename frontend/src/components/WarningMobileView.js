import React from 'react'
import logo from '../assets/logo/Logo.png'

const WarningMobileView = () => {
    return (
        <div className="flex flex-col min-h-screen items-center justify-center text-center">
            <img src={logo} className="min-h-[100px] pointer-events-none" alt="logo" />
            <p className='pl-[10%] pr-[10%] font-serif text-center font-bold text-[20px]'>
                Sorry, this website is only available on desktop devices.
            </p>
        </div>
    )
}

export default WarningMobileView