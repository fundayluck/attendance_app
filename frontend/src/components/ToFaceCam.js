import React, { useCallback, useRef } from 'react'
import Webcam from "react-webcam";
import { AiOutlineCamera } from 'react-icons/ai'
import { MdReplay } from 'react-icons/md'

const ToFaceCam = ({ data, setData }) => {

    const webcamRef = useRef(null);

    const videoConstraints = {
        width: 420,
        height: 420,
        facingMode: "user",
    };

    const capture = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        setData({ ...data, image: imageSrc });
    }, [webcamRef, setData, data]);

    return (
        <>
            {data?.image === null ? (
                <div className='flex flex-row justify-center items-end mb-2'>
                    <Webcam
                        audio={false}
                        mirrored={true}
                        height={400}
                        width={400}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        videoConstraints={videoConstraints}
                        className='rounded-full'
                    />
                    <div className='absolute text-black border border-black bg-gray-200 border-1 p-2 rounded-full cursor-pointer mb-2 hover:bg-gray-300' onClick={capture}>
                        <AiOutlineCamera className='text-4xl' />
                    </div>
                </div>
            ) : (
                <div className='flex flex-row justify-center items-end'>
                    <img src={data.image} alt="screenshot" className='rounded-full' />
                    <div
                        className='absolute text-black border border-gray-300 bg-gray-200 border-1 p-2 rounded-full cursor-pointer mb-2 hover:bg-gray-300 '
                        onClick={() => setData({ image: null })}
                    >
                        <MdReplay className='text-4xl text-black' />
                    </div>
                </div>
            )}
        </>
    )
}


export default ToFaceCam