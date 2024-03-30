import moment from 'moment';
import Chart from "react-apexcharts";




const Charts = ({ dt }) => {


    const labels = dt.map(item => moment(item.date).format('ddd,DD MMM YYYY'));

    const option = {

        options: {
            chart: {
                type: 'line',
            },
            xaxis: {
                categories: labels
            },
            stroke: {
                curve: 'smooth'
            },
        },
        series: [
            {
                name: "Attend",
                data: dt.map(item => item.attend)
            },
            {
                name: "Late",
                data: dt.map(item => item.late)
            },
            {
                name: 'Alpha',
                data: dt.map(item => item.alpha),
            },
            {
                name: 'Permit',
                data: dt.map(item => item.permit),
            },
            {
                name: 'Leave',
                data: dt.map(item => item.leave),
            },
        ]
    };

    return (
        <div className='z-10'>
            <Chart
                options={option.options}
                series={option.series}
                type="line"
                // width="450"
                height="450"
            />
        </div>
    )
}

export default Charts