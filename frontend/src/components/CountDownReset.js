import { useEffect, useState } from 'react'
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const CountDown = ({ count }) => {
    const [countdown, setCountdown] = useState('');
    const navigate = useNavigate()
    useEffect(() => {
        let end = moment(count.exp * 1000)._d
        const endDate = moment(end); // Set your desired end date and time here
        const interval = setInterval(() => {
            const now = moment();
            const diff = endDate.diff(now);
            const duration = moment.duration(diff);
            const minutes = ("0" + duration.minutes());
            const seconds = ("0" + duration.seconds()).slice(-2);
            setCountdown(`${minutes}:${seconds}`);

            if (diff <= 0) {
                clearInterval(interval);
                navigate('/detail-user')
                Swal.fire({
                    position: 'center',
                    icon: 'warning',
                    title: "Your code is Expired",
                    showConfirmButton: false,
                })
            }
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    }, [count, navigate]);
    return <p>{countdown}</p>
}

export default CountDown