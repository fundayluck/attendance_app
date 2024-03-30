const Permit = require('../models/permit')
const Attendance = require('../models/attendance')
const cron = require('node-cron')
const { getSatSun, timetoseconds, secondstotime, getTime, getDates } = require('../helper')

const FindPending = async () => {
    let date = getTime(0, "Y-m-d");
    let my_date = date.split('-')
    let year = parseInt(my_date[0]);
    let month = parseInt(my_date[1]);
    let day = parseInt(my_date[2]);
    const permit = await Permit.find({ is_accepted: null })
    for (let i = 0; i < permit.length; i++) {
        if (getDates(permit[i].start_date, 0, "Y-m-d") <= getDates(`${year}-${month}-${day}`, 0, "Y-m-d")) {
            await Permit.findOneAndUpdate(
                { _id: permit[i]._id },
                {
                    is_accepted: 0
                }
            )
        } else {
            return null
        }
    }
}
FindPending()
cron.schedule('0 3 * * *', () => {
    FindPending()
})


module.exports = {
    getPermitById: async (req, res) => {

        try {
            const permit = await Permit.find({
                _id: req.params.idPermit,

            })
                .populate({
                    path: 'id_staff',
                    populate: {
                        path: 'id_staff',
                        populate: {
                            path: 'id_division',
                            select: 'name'
                        }
                    }
                })
            console.log(permit);
            res.status(200).send({
                status: true,
                data: permit
            })

        } catch (error) {
            res.status(400).send({
                status: false,
                message: error.message
            })
        }
    },
    getStaffPermitById: async (req, res) => {
        const getId = req.user._id
        let date = getTime(0, "Y-m-d");
        let my_date = date.split('-')
        let year = parseInt(my_date[0]);
        let month = parseInt(my_date[1]);
        let query = req.query.date !== '' ? req.query.date.split('-') : null
        const currentDate = req.query.date !== '' ? new Date(req.query.date) : null
        if (currentDate === null) {
            null
        } else {
            currentDate.setDate(31)
        }
        const format = getDates(currentDate, 0, "Y-m-d")
        let currentD = format.split('-')
        let currentDays
        if (Number(currentD[2]) === 1) {
            currentDays = 30
        } else if (Number(currentD[2]) === 31) {
            currentDays = 31
        } else if (Number(currentD[2]) === 3) {
            currentDays = 28
        } else if (Number(currentD[2]) === 4) {
            currentDays = 29
        }
        let start = query !== null ? getDates(`${query[0]}-${query[1]}-01`, 0, "Y-m-d") : getDates(`${year}-${month}-1`, 0, "Y-m-d")
        let end = query !== null ? getDates(`${query[0]}-${query[1]}-${currentDays}`, 0, "Y-m-d") : getDates(`${year}-${month}-${currentDays}`, 0, "Y-m-d")
        try {
            const permit = await Permit.find({
                id_staff: getId,
                start_date: {
                    $gte: new Date(start),
                    $lte: new Date(end)
                }
            }).populate({
                path: 'id_staff',
                populate: {
                    path: 'id_staff',
                    populate: {
                        path: 'id_division',
                        select: 'name'
                    }
                }
            })
            if (permit.length < 1) {
                res.status(404).send({
                    status: false,
                    message: "You don't have a permit or leave request yet"
                })
            } else {
                res.status(200).send({
                    status: true,
                    data: permit
                })
            }
        } catch (error) {
            res.status(400).send({
                status: false,
                message: error.message
            })
        }
    },
    getStaffPermit: async (req, res) => {
        let date = getTime(0, "Y-m-d");
        let my_date = date.split('-')
        let year = parseInt(my_date[0]);
        let month = parseInt(my_date[1]);
        let query = req.query.date !== '' ? req.query.date.split('-') : null
        const currentDate = req.query.date !== '' ? new Date(req.query.date) : null
        if (currentDate === null) {
            null
        } else {
            currentDate.setDate(31)
        }
        const format = getDates(currentDate, 0, "Y-m-d")
        let currentD = format.split('-')
        let currentDays
        if (Number(currentD[2]) === 1) {
            currentDays = 30
        } else if (Number(currentD[2]) === 31) {
            currentDays = 31
        } else if (Number(currentD[2]) === 3) {
            currentDays = 28
        } else if (Number(currentD[2]) === 4) {
            currentDays = 29
        }
        let start = query !== null ? getDates(`${query[0]}-${query[1]}-01`, 0, "Y-m-d") : getDates(`${year}-${month}-1`, 0, "Y-m-d")
        let end = query !== null ? getDates(`${query[0]}-${query[1]}-${currentDays}`, 0, "Y-m-d") : getDates(`${year}-${month}-${currentDays}`, 0, "Y-m-d")
        try {
            const permit = await Permit.find({
                start_date: {
                    $gte: new Date(start),
                    $lte: new Date(end)
                }
            }).populate({
                path: 'id_staff',
                populate: {
                    path: 'id_staff',
                    populate: {
                        path: 'id_division',
                        select: 'name'
                    }
                }
            })
            if (permit.length < 1) {
                res.status(200).send({
                    status: false,
                    message: "you don't have records of Permit or Leave"
                })
            } else {
                res.status(200).send({
                    status: true,
                    data: permit
                })
            }
        } catch (error) {
            res.status(400).send({
                status: false,
                message: error.message
            })
        }
    },
    addPermit: async (req, res) => {
        const { status, start_date, end_date, note } = req.body
        let my_start_date = start_date.split('-')
        let start_year = parseInt(my_start_date[0]);
        let start_month = parseInt(my_start_date[1]) - 1;
        let start_day = parseInt(my_start_date[2]);
        let my_end_date = end_date.split('-')
        let end_year = parseInt(my_end_date[0]);
        let end_month = parseInt(my_end_date[1]) - 1;
        let end_day = parseInt(my_end_date[2]);
        let weekend = getSatSun(start_month, start_year);
        let id_staff = req.user._id
        let file;

        if (req.file === undefined) {
            file = null
        } else {
            file = req.file.path
        }

        try {
            if (status === undefined || start_date === undefined || end_date === undefined) {
                throw Error('params missing!')
            }
            for (let i = 0; i < weekend.length; i++) {
                if (weekend[i] == start_day || weekend[i] == end_day) {
                    throw Error("That day is weekend! You can't request Leave or Permit.")
                }
            }
            const permit = new Permit({
                id_staff,
                id_HR: null,
                start_date,
                end_date,
                status,
                note,
                proof: file,
                notes_hr: null,
                is_accepted: null
            })
            await permit.save()
            res.status(200).send({
                status: true,
                data: permit
            })
        } catch (error) {
            res.status(400).send({
                status: false,
                message: error.message
            })
        }
    },
    editPermit: async (req, res) => {
        const { is_accepted, notes_hr } = req.body
        try {
            const role = req.user.role
            const id_hr = req.user._id
            const id_staff = await Permit.findOne({ _id: req.params.permitId })
            console.log('log', id_staff);
            if (id_staff === null) {
                throw Error("something when wrong!")
            } else
                if (String(id_staff.id_staff) === String(id_hr)) {
                    throw Error("you Can't accept or refuse your self")
                } else
                    if (role === 'HR') {
                        const permit = await Permit.findOneAndUpdate(
                            { _id: req.params.permitId },
                            {
                                id_HR: id_hr,
                                notes_hr,
                                is_accepted
                            }
                        )
                        res.status(200).send({
                            status: true,
                            data: permit
                        })
                        if (is_accepted === 1) {
                            console.log('do record to attendance database');
                            let start = getDates(id_staff.start_date, 0, "Y-m-d").split("-")
                            let end = getDates(id_staff.end_date, 0, "Y-m-d").split("-")
                            let sd = parseInt(end[2]) - parseInt(start[2])

                            for (let i = 0; i <= sd; i++) {
                                const recordAttend = new Attendance({
                                    id_user: id_staff.id_staff,
                                    status: id_staff.status,
                                    date: getDates(id_staff.start_date, i, "Y-m-d"),
                                    latitude: null,
                                    longitude: null,
                                    clock_in: null,
                                    clock_out: null,
                                    photo: null
                                })
                                await recordAttend.save()
                            }

                        } else {
                            console.log('do nothing');
                        }
                    } else {
                        throw Error('sorry, your not HR')
                    }
        } catch (error) {
            res.status(400).send({
                status: false,
                message: error.message
            })
        }
    }
}