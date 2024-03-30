import { useState } from 'react'
import AttendanceTable from '../components/attendance/AttendanceTable'
import AttendanceChart from '../components/attendance/AttendanceChart'

const Attendance = () => {
    const [showTable, setShowTable] = useState(true)
    const [isShowTable, setIsShowTable] = useState(true)
    const [showChart, setshowChart] = useState(false)
    const [isShowChart, setIsShowChart] = useState(false)

    const handleTable = () => {
        !showTable ?
            setShowTable(true)
            :
            setShowTable(false)
        setIsShowChart(false)
        setIsShowTable(true)
        setshowChart(false)
    }
    const handleChart = () => {
        !showChart
            ?
            setshowChart(true)
            :
            setshowChart(false)

        setIsShowTable(false)
        setIsShowChart(true)
        setShowTable(false)
    }
    return (
        <>
            <div className='fixed bg-[#F1F9F9] mt-[-4px] w-[75%]'>

                <div className='flex justify-between mb-10'>
                    <h1 className='text-[26px] font-bold text-[#3A5372]'>Employees Attendance</h1>
                    <div className='flex items-center mr-20 bg-gray-200 rounded'>
                        <button
                            className={`mx-2 ${isShowTable ? 'underline' : ''}`}
                            onClick={handleTable}
                            disabled={isShowTable}
                        >
                            Table
                        </button>
                        <button
                            className={`mx-2 ${isShowChart ? 'underline' : ''}`}
                            onClick={handleChart}
                            disabled={isShowChart}
                        >
                            Chart
                        </button>
                    </div>
                </div>
            </div>
            <div>

                <div className='w-[92%]' >
                    {isShowTable ? <AttendanceTable /> : <AttendanceChart />}
                </div>
            </div >
        </>
    )
}

export default Attendance