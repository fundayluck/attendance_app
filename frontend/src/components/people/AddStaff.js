import { useEffect, useState } from 'react'
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import Button from '../common/Button'
import apis from '../../apis';
import useAuth from '../../ahooks/useAuth'
import Photo from '../../assets/images/photo.jpg'
import Swal from 'sweetalert2';
import moment from 'moment';
import { ImSpinner2 } from 'react-icons/im';

const AddStaff = ({ edit, user }) => {
    const { auth } = useAuth()
    const [nip, setNip] = useState('')
    const [name, setName] = useState('')
    const [position, setPosition] = useState('')
    const [birth, setBirth] = useState('')
    const [phone, setPhone] = useState('')
    const [gender, setGender] = useState('Laki-laki')
    const [address, setAddress] = useState('')
    const [NIK, setNIK] = useState('')
    const [area, setArea] = useState('')
    const [image, setImage] = useState(null)
    const [preview, setPreview] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const { id } = useParams()

    const navigate = useNavigate()

    const handleMale = () => {
        setGender('Laki-laki')
    }
    const handleFemale = () => {
        setGender('Perempuan')
    }

    useEffect(() => {
        const fetch = async (e) => {
            if (edit) {
                const response = await apis.get(`/api/staff/${id}`, {
                    headers: {
                        Authorization: `Bearer ${auth?.token}`,
                    },
                })
                setNip(response.data.data._id)
                setPosition(response.data.data.id_division._id)
                setName(response.data.data.name)
                setPhone(response.data.data.phone)
                setArea(response.data.data.area)
                setAddress(response.data.data.address)
                setNIK(response.data.data.NIK)
                setGender(response.data.data.gender)
                setBirth(moment(response.data.data.birth).format('YYYY-MM-DD'))
                setImage(response.data.data.photo)
            }
        }
        fetch()
    }, [id, auth, edit])

    const createStaff = async (e) => {
        e.preventDefault()
        try {
            setIsLoading(true)
            const formData = new FormData();
            formData.append("_id", nip);
            formData.append("id_division", position);
            formData.append("name", name);
            formData.append("phone", phone);
            formData.append("gender", gender);
            formData.append("birth", birth);
            formData.append("area", area);
            formData.append("address", address);
            formData.append("NIK", NIK);
            formData.append("image", image);
            if (image === null) {
                setIsLoading(false)
                return Swal.fire({
                    position: 'center',
                    icon: 'warning',
                    title: 'please, upload photo is required!',
                    showConfirmButton: true,
                })
            } else if (position === '') {
                setIsLoading(false)
                return Swal.fire({
                    position: 'center',
                    icon: 'warning',
                    title: 'please, choose your position',
                    showConfirmButton: true,
                })
            } else if (birth === '') {
                setIsLoading(false)
                return Swal.fire({
                    position: 'center',
                    icon: 'warning',
                    title: 'please, fill your birth day',
                    showConfirmButton: true,
                })
            }
            const response = await apis.post(
                `api/create-account`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${auth?.token}`,
                    },
                }
            );
            if (response.data.status === true) {
                setIsLoading(false)
                navigate('/people')
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Create Staff Success!',
                    showConfirmButton: true,
                })
            }

        } catch (error) {
            setIsLoading(false)
            return Swal.fire({
                position: 'center',
                icon: 'warning',
                title: error.response.data.message,
                showConfirmButton: true,
            })
        }
    }

    const EditStaff = async (e) => {
        e.preventDefault()
        try {
            setIsLoading(true)
            await apis(`api/staff/${id}/edit`, {
                headers: {
                    Authorization: `Bearer ${auth?.token}`,
                },
                method: "PUT",
                data: {
                    name,
                    id_division: position,
                    phone,
                    birth,
                    address,
                    NIK,
                    gender,
                    area
                }
            })
            setIsLoading(false)
            user === undefined && navigate('/people')
            user === true && navigate('/detail-user')
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Edited Staff Success!',
                showConfirmButton: true,
            })
        } catch (error) {
            setIsLoading(false)
            return Swal.fire({
                position: 'center',
                icon: 'warning',
                title: error.response.data.message,
                showConfirmButton: true,
            })
        }
    }

    const handleImage = (e) => {
        setImage(e.target.files[0]);
        setPreview(URL.createObjectURL(e.target.files[0]))
    }

    const AlertEditPhoto = () => {
        Swal.fire({
            position: 'center',
            icon: 'warning',
            title: 'You are not allowed to update photo',
            showConfirmButton: true,
        })
    }

    return (
        <div>
            <h1 className='text-[26px] font-bold text-[#3A5372]'>{edit ? "Edit Employee" : "Add Employee"}</h1>
            <form onSubmit={edit ? EditStaff : createStaff}>
                <div className='grid grid-rows-2 grid-flow-col'>
                    <div className='row-span-2'>
                        {image === null ?
                            <>
                                <label htmlFor='files' >
                                    <img src={Photo} alt='' className='ml-5 w-[150px] h-[150px] border-2 border-dotted cursor-pointer rounded' />
                                </label>
                                < input id='files' type='file' disabled={edit} className='hidden' onChange={handleImage} />
                            </>
                            :
                            <>
                                <label htmlFor='files' >
                                    <img
                                        src={edit ? Photo : preview}
                                        onClick={edit ? AlertEditPhoto : null}
                                        alt=''
                                        className={`ml-5 w-[150px] h-[150px] rounded cursor-pointer`}
                                    />
                                </label>
                                < input id='files' type='file' disabled={edit} className='hidden' onChange={handleImage} />
                            </>
                        }
                    </div>
                    <div className='col-span-2 flex flex-col gap-1'>
                        <label className='text-[18px] text-[#3A5372] font-bold pl-1'>NIP</label>
                        <input
                            className='bg-[#F1F9F9] border-b-2 w-[320px] px-2 my-2 outline-0 leading-loose'
                            placeholder='NIP'
                            pattern='[0-9][0-9][0-9]'
                            title="NIP can only contain 3 digit numbers. e.g. 001"
                            required
                            disabled={edit}
                            value={nip}
                            onChange={(e) => setNip(e.target.value)}
                        />
                    </div>
                    <div className='col-span-2 flex flex-col'>
                        <label className='text-[18px] text-[#3A5372] font-bold pl-1'>Name</label>
                        <input
                            className='bg-[#F1F9F9] border-b-2 w-[320px] px-2 my-2 outline-0 leading-loose'
                            placeholder='Name'
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                </div>
                <div className='grid grid-rows-4 grid-flow-col'>
                    <div className='row-span-1 flex flex-col'>
                        <label className='text-[18px] text-[#3A5372] font-bold pl-1'>Position</label>
                        <select value={position} onChange={(e) => setPosition(e.target.value)} className="w-[244px] p-2 border border-[#C7C9D9] rounded">
                            <option>Choose the Position</option>
                            <option value="63aa9cb408bb3db4b26d2a11">Sales Respresentative</option>
                            <option value="63aa9cdd08bb3db4b26d2a12">Human Resources</option>
                            <option value="63aa9d1308bb3db4b26d2a13">Accounting</option>
                            <option value="63be60dd64e1a662c1eaa3c7">Software Engineer</option>
                        </select>
                    </div>
                    <div className='row-span-1 flex flex-col'>
                        <label className='text-[18px] text-[#3A5372] font-bold pl-1'>Phone</label>
                        <input
                            required
                            type='tel'
                            className='bg-[#F1F9F9] border-b-2 w-[320px] px-2 my-2 outline-0 leading-loose'
                            placeholder='ex: 08xxxxxxxxx'
                            pattern='^(\+62|62|0)8[1-9][0-9]{6,9}$'
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>
                    <div className='row-span-1 flex flex-col'>
                        <label className='text-[18px] text-[#3A5372] font-bold pl-1'>Area</label>
                        <input
                            required
                            type='text'
                            className='bg-[#F1F9F9] border-b-2 w-[320px] px-2 my-2 outline-0 leading-loose'
                            placeholder='Area'
                            value={area}
                            onChange={(e) => setArea(e.target.value)}
                        />
                    </div>
                    <div className='col-span-1 flex flex-col'>
                        <label className='text-[18px] text-[#3A5372] font-bold pl-1'>Address</label>
                        <input
                            className='bg-[#F1F9F9] border-b-2 w-[320px] px-2 my-2 outline-0 leading-loose'
                            placeholder='Address'
                            required
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </div>
                    <div className='col-span-1 flex flex-col'>
                        <label className='text-[18px] text-[#3A5372] font-bold pl-1'>Birth Date</label>
                        <input type='date'
                            value={birth}
                            onChange={(e) => setBirth(e.target.value)}
                            className="w-[244px] p-1 border border-[#C7C9D9] rounded"
                        />
                    </div>
                    <div className='row-span-1 flex flex-col mb-1'>
                        <label className='text-[18px] text-[#3A5372] font-bold pl-1'>Gender</label>
                        <div className="flex items-center mb-4">
                            <input
                                type="radio"
                                checked={gender === 'Laki-laki'}
                                onChange={handleMale}
                                className="w-4 h-4 text-[#3A5372] bg-gray-100 border-gray-300"
                            />
                            <label className="ml-2 text-sm font-medium text-[#3A5372] ">male</label>
                        </div>
                        <div className="flex items-center">
                            <input
                                type="radio"
                                checked={gender === 'Perempuan'}
                                onChange={handleFemale}
                                className="w-4 h-4 text-[#3A5372] bg-gray-100 border-gray-300"
                            />
                            <label className="ml-2 text-sm font-medium text-[#3A5372] ">female</label>
                        </div>
                    </div>
                    <div className='col-span-1 flex flex-col'>
                        <label className='text-[18px] text-[#3A5372] font-bold pl-1'>NIK</label>
                        <input
                            className='bg-[#F1F9F9] border-b-2 w-[320px] px-2 my-2 outline-0 leading-loose'
                            placeholder='NIK'
                            required
                            pattern='^(1[1-9]|21|[37][1-6]|5[1-3]|6[1-5]|[89][12])\d{2}\d{2}([04][1-9]|[1256][0-9]|[37][01])(0[1-9]|1[0-2])\d{2}\d{4}$'
                            value={NIK}
                            onChange={(e) => setNIK(e.target.value)}
                        />
                    </div>
                    <div className='flex justify-start mt-10'>
                        <Button
                            name={
                                isLoading ? <ImSpinner2 className='animate-spin' /> :
                                    edit ? 'Edit' : 'Create'
                            }
                            type='submit'
                            className='bg-[#F6E7E6] h-[40px] px-2 py-1 rounded-md tracking-wider text-[17px] text-[#3A5372] shadow hover:shadow-md mr-2'
                        />
                        <NavLink to={user ? '/detail-user' : '/People'}>
                            <Button
                                name='Discard'
                                type='button'
                                className='bg-[#4A77AE] h-[40px] px-2 py-1 rounded-md tracking-wider text-[17px] text-[#FFFFFF] shadow hover:shadow-md '
                            />
                        </NavLink>
                    </div>
                </div>

            </form >
        </div >
    )
}

export default AddStaff