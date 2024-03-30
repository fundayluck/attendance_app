import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'


const LoadingToRedirect = () => {
    const [count, setCount] = useState(5)
    const navigate = useNavigate()

    useEffect(() => {
        const interval = setInterval(() => {
            setCount((currentCount) => currentCount - 1)
        }, 1000)

        count === 0 && navigate('/')

        return () => clearInterval(interval)
    }, [count, navigate])

    return (
        <p className='fixed flex flex-row items-center justify-center h-full w-full'>Redirecting you in {count} sec</p>
    )
}

export default LoadingToRedirect