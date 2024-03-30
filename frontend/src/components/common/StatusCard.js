

const StatusCard = ({ status }) => {
    let Content

    if (status === 1) {
        Content = 'Active'
    }
    if (status === 0) {
        Content = 'Non-Active'
    }

    return (
        <div className={`${status ? "bg-[#3A5372] text-white" : "bg-[#E6F3E5]"} flex justify-center rounded px-2`}>
            {Content}
        </div>
    )

}

export default StatusCard