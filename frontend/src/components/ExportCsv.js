import moment from 'moment';
import React from 'react'
import * as XLSX from 'xlsx';

const ExportCsv = ({ disable, data }) => {
    const result = []

    for (let i = 0; i < data.length; i++) {
        result.push({
            'no': i + 1,
            'name': data[i]?.id_user?.id_staff?.name,
            'date': moment(data[i]?.date).format('DD-MM-YYYY'),
            'division': data[i]?.id_user?.id_staff?.id_division?.name,
            'clock in': data[i]?.clock_in ? moment(data[i]?.clock_in).format('LT') : '--:--',
            'clock Out': data[i]?.clock_in ? moment(data[i]?.clock_out).format('LT') : '--:--',
            'status': data[i]?.status
        })
    }


    const handleOnExport = () => {
        const wb = XLSX.utils.book_new(),
            ws = XLSX.utils.json_to_sheet(result)

        XLSX.utils.book_append_sheet(wb, ws, `sheet 1`);

        XLSX.writeFile(wb, `Laporan Presensi Periode ${moment(data[0]?.date).format('MMMM-YYYY')}.xlsx`)

    }
    return (
        <button
            disabled={disable === null ? true : false}
            className={`${disable === null ? 'bg-[#cccccc]' : 'bg-[#F6E7E6]'}  px-2 py-1 rounded-md tracking-wider text-[17px] text-[#3A5372] shadow hover:${disable === null ? '' : 'shadow-md'}`}
            onClick={handleOnExport}
        >
            Report
        </button>
    )
}

export default ExportCsv