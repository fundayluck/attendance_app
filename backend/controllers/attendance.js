const fs = require('fs')
const Attendance = require('../models/attendance')
const moment = require('moment/moment')
const Config = require('../models/config')
const User = require('../models/user')
const cron = require('node-cron')
const { getSatSun, timetoseconds, secondstotime, getTime, getDates, getNotSatSun } = require('../helper')


const notAttend = async () => {
    let date = getTime(0, 'Y-m-d')
    const user = await User.find({ is_attend: 1, is_active: 1 })
    for (let i = 0; i < user.length; i++) {
        const j = new Attendance({
            id_user: user[i].id,
            status: "Alpha",
            date: date,
            latitude: null,
            longitude: null,
            clock_in: null,
            clock_out: null,
            photo: null
        })
        const userdoattend = await User.findOneAndUpdate(
            { _id: user[i]._id },
            {
                is_attend: 0
            }
        )
        await j.save()
        await userdoattend.save()
    }
}

const changeStatus = async () => {
    let date = getTime(0, "Y-m-d");
    const attend = await Attendance.find({ date })

    const user = await User.find()

    let userLeaveOrPermit = []
    for (let i = 0; i < attend.length; i++) {
        userLeaveOrPermit.push(attend[i].id_user);
    }

    let allUser = []
    for (let i = 0; i < user.length; i++) {
        allUser.push(user[i]._id);
    }

    const filteredArray = [];
    for (let i = 0; i < allUser.length; i++) {
        if (!JSON.stringify(userLeaveOrPermit)
            .includes(JSON.stringify(allUser[i]))) {
            filteredArray.push(allUser[i])
        }
    }

    for (let i = 0; i < filteredArray.length; i++) {
        const userdoattend = await User.findOneAndUpdate(
            { _id: filteredArray[i] },
            {
                is_attend: 1
            }
        )
        await userdoattend.save()
    }
}

cron.schedule('0 0 * * 1-5', () => { changeStatus() })
cron.schedule('0 12 * * 1-5', () => { notAttend() })

module.exports = {
    getAttendance: async (req, res) => {
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
        let end = query !== null ? getDates(`${query[0]}-${query[1]}-${currentDays}`, 0, "Y-m-d") : getDates(date, 0, "Y-m-d")

        try {
            const attend = await Attendance.find({
                date: {
                    $gte: new Date(start),
                    $lte: new Date(end)
                }
            }).populate({
                path: 'id_user',
                populate: {
                    path: 'id_staff',
                    populate: {
                        path: 'id_division',
                        select: 'name'
                    }
                }
            })
            if (attend.length < 1) {
                return res.status(200).send({
                    status: false,
                    message: "you don't have records of staff"
                })
            } else {
                return res.status(200).send({
                    status: true,
                    data: attend
                })
            }
        } catch (error) {
            res.status(400).send({
                status: false,
                message: error.message
            })
        }
    },
    getAttendanceByStaff: async (req, res) => {
        let date = getTime(0, "Y-m-d");
        let my_date = date.split('-')
        let year = parseInt(my_date[0]);
        let month = parseInt(my_date[1]);
        let start = getDates(`${year}-${month}-1`, 0, "Y-m-d")
        let end = getDates(date, 0, "Y-m-d")

        const attend = await Attendance.find({
            id_user: req.user._id,
            date: {
                $gte: new Date(start),
                $lte: new Date(end)
            }
        })

        if (attend.length > 0) {
            res.status(200).send({
                status: true,
                data: attend
            })
        } else {
            res.status(200).send({
                status: false,
                message: `you don't have records of your attendance`
            })
        }
    },
    clock_in: async (req, res) => {
        const {
            latitude,
            longitude,
        } = req.body
        try {
            const config = await Config.find()
            let date = getTime(0, "Y-m-d");
            let my_date = date.split('-')
            let year = parseInt(my_date[0]);
            let month = parseInt(my_date[1]) - 1;
            let day = parseInt(my_date[2]);
            let weekend = getSatSun(month, year);
            for (let i = 0; i < weekend.length; i++) {
                if (weekend[i] == day) {
                    return res.status(400).send({
                        status: false,
                        message: "Today is weekend! No need to clock in today!"
                    });
                }
            }

            const findSameDate = await Attendance.findOne({ date, id_user: req.user._id })
            if (findSameDate) {
                return res.status(400).send({
                    status: false,
                    message: "You don't need a clock these days!"
                })
            }
            else {
                const path = 'staffPicture/' + Date.now() + '.png'
                const imgData = req.body.image
                const base64Data = imgData.replace(/^data:([A-Za-z-+/]+);base64,/, '')
                fs.writeFileSync(path, base64Data, { encoding: 'base64' })
                let time = getTime(0, "H:i:s")
                let start = config[0].start_working
                let late = config[0].late


                if (timetoseconds(time) < (timetoseconds(start) - 4200)) {
                    return res.status(400).send({
                        status: false,
                        message: "You can't log in now! You can start the clock in 10 minutes before " + secondstotime(timetoseconds(start) - 3600)
                    });
                } else if (timetoseconds(time) > timetoseconds(late)) {
                    return res.status(400).send({
                        status: false,
                        message: "Sorry you logged in later than " + late + " after " + secondstotime(timetoseconds(start) - 3600) + " ! So we think of you as the alpha."
                    });
                } else if (timetoseconds(time) >= (timetoseconds(start) - 4200) && timetoseconds(time) <= timetoseconds(start)) {
                    const dateString = `${getTime(0, 'Y-m-d')}`
                    const input = time
                    const hours = input.slice(0, 2)
                    const minutes = input.slice(3, 5)
                    const seconds = input.slice(6, 8)
                    const datetime = new Date(dateString)
                    datetime.setHours(hours, minutes, seconds)
                    const attend = new Attendance({
                        id_user: req.user._id,
                        status: "Attend",
                        date: date,
                        latitude,
                        longitude,
                        clock_in: datetime,
                        clock_out: null,
                        photo: {
                            clock_in: path,
                            clock_out: null
                        }
                    })
                    const user = await User.findOneAndUpdate(
                        { _id: req.user._id },
                        {
                            is_attend: 0
                        }
                    )
                    await user.save()
                    await attend.save()
                    res.status(200).send({
                        data: attend
                    })
                } else {
                    const dateString = `${getTime(0, 'Y-m-d')}`
                    const input = time
                    const hours = input.slice(0, 2)
                    const minutes = input.slice(3, 5)
                    const seconds = input.slice(6, 8)
                    const datetime = new Date(dateString)
                    datetime.setHours(hours, minutes, seconds)
                    const attend = new Attendance({
                        id_user: req.user._id,
                        status: "Late",
                        date: date,
                        latitude,
                        longitude,
                        clock_in: datetime,
                        photo: {
                            clock_in: path,
                            clock_out: null
                        },
                    })
                    const user = await User.findOneAndUpdate(
                        { _id: req.user._id },
                        {
                            is_attend: 0
                        }
                    )
                    await user.save()
                    await attend.save()
                    res.status(200).send({
                        data: attend
                    })
                }
            }
        } catch (error) {
            res.status(500).send({
                message: "Something broke!"
            })
        }
    },
    clock_out: async (req, res) => {
        try {
            const path = 'staffPicture/' + Date.now() + '.png'
            const imgData = req.body.image
            const base64Data = imgData.replace(/^data:([A-Za-z-+/]+);base64,/, '')
            fs.writeFileSync(path, base64Data, { encoding: 'base64' })
            const config = await Config.find()
            let date = moment().format("YYYY-MM-DD")
            const find = await Attendance.findOne({ id_user: req.user._id, date })
            const clock_in = moment(find.clock_in).format('HH:mm:ss')
            let time = getTime(0, "H:i:s")
            let finish = config[0].finish_working
            let total_hours = secondstotime(timetoseconds(time) - timetoseconds(clock_in));

            if (timetoseconds(time) < timetoseconds(finish)) {
                return res.status(400).send({
                    status: false,
                    message: "You can't get out now! You can start the clock out after " + finish
                });
            } else if (timetoseconds(time) >= timetoseconds(finish)) {
                const dateString = `${getTime(0, 'Y-m-d')}`
                const input = time
                const hours = input.slice(0, 2)
                const minutes = input.slice(3, 5)
                const seconds = input.slice(6, 8)
                const datetime = new Date(dateString)
                datetime.setHours(hours, minutes, seconds)
                const attend = await Attendance.findOneAndUpdate(
                    { id_user: req.user._id, date },
                    {
                        clock_out: datetime,
                        totalhours: total_hours,
                        $push: { photo: { clock_out: path } }
                    },
                )
                await attend.save()
                res.status(200).send({
                    status: true,
                    message: 'successfully clocked out!'
                })
            }
        } catch (error) {
            console.log(error);
        }

    },
    cekAttendance: async (req, res) => {
        let date = getTime(0, 'Y-m-d')
        let my_date = date.split('-')
        let year = parseInt(my_date[0]);
        let month = parseInt(my_date[1]) - 1;
        let day = parseInt(my_date[2]);
        let weekend = getSatSun(month, year);
        for (let i = 0; i < weekend.length; i++) {
            if (weekend[i] == day) {
                return res.status(200).send({
                    status: true,
                    clock_in: 0,
                    clock_out: 0,
                    weekend: 1
                });
            }
        }
        const attend = await Attendance.find({ id_user: req.user._id, date })
        if (attend.length == 1 && attend[0].status === 'Alpha') {
            return res.status(200).send({
                status: true,
                clock_in: 1,
                clock_out: 1,
                weekend: 0,
                permit: 1,
                leave: 0
            })
        } else
            if (attend.length == 1 && attend[0].status === 'Permit') {
                return res.status(200).send({
                    status: true,
                    clock_in: 0,
                    clock_out: 0,
                    weekend: 0,
                    permit: 1,
                    leave: 0
                })
            } else
                if (attend.length == 1 && attend[0].status === 'Leave') {
                    return res.status(200).send({
                        status: true,
                        clock_in: 0,
                        clock_out: 0,
                        weekend: 0,
                        permit: 0,
                        leave: 1
                    })
                } else
                    if (attend.length == 1 && attend[0].clock_in && attend[0].clock_out) {
                        return res.status(200).send({
                            status: true,
                            clock_in: 1,
                            clock_out: 1,
                            weekend: 0,
                            permit: 0,
                            leave: 0
                        })
                    }
                    else
                        if (attend.length == 1 && attend[0].clock_out == null) {
                            return res.status(200).send({
                                status: true,
                                clock_in: 0,
                                clock_out: 1,
                                weekend: 0,
                                permit: 0,
                                leave: 0
                            })

                        } else {
                            return res.status(200).send({
                                status: true,
                                clock_in: 1,
                                clock_out: 0,
                                weekend: 0,
                                permit: 0,
                                leave: 0
                            })
                        }
    },
    getAttendanceById: async (req, res) => {
        try {
            const getAttendance = await Attendance.findOne({ _id: req.params.attendanceId }).populate({
                path: 'id_user',
                populate: {
                    path: 'id_staff',
                    populate: {
                        path: 'id_division',
                        select: 'name'
                    }
                }
            })
            res.status(200).send({
                status: true,
                data: getAttendance
            })
        } catch (error) {
            res.status(400).send({
                status: false,
                message: 'error'
            })
        }
    },
    chart: async (req, res) => {
        let date = getTime(0, "Y-m-d");
        let my_date = date.split('-')
        let year = parseInt(my_date[0]);
        let month = parseInt(my_date[1]);
        let role = req.user.role
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
        let end = query !== null ? getDates(`${query[0]}-${query[1]}-${currentDays}`, 0, "Y-m-d") : getDates(date, 0, "Y-m-d")
        let endDays = end.split('-')
        try {
            if (role === 'STAFF') {
                throw Error("not allowed by the system!")
            } else if (query !== null) {
                let data = []
                for (let i = 1; i <= parseInt(endDays[2]); i++) {
                    let j
                    if (i <= 9) {
                        j = `0${i}`
                    } else {
                        j = i
                    }

                    const attend = await Attendance.find({
                        date: getDates(`${endDays[0]}-${endDays[1]}-${j}`, 0, "Y-m-d"),
                        status: "Attend",

                    })
                    const late = await Attendance.find({
                        date: getDates(`${endDays[0]}-${endDays[1]}-${j}`, 0, "Y-m-d"),
                        status: "Late"
                    })
                    const permit = await Attendance.find({
                        date: getDates(`${endDays[0]}-${endDays[1]}-${j}`, 0, "Y-m-d"),
                        status: "Permit"
                    })
                    const leave = await Attendance.find({
                        date: getDates(`${endDays[0]}-${endDays[1]}-${j}`, 0, "Y-m-d"),
                        status: "Leave"
                    })
                    const alpha = await Attendance.find({
                        date: getDates(`${endDays[0]}-${endDays[1]}-${j}`, 0, "Y-m-d"),
                        status: "Alpha"
                    })
                    data.push({
                        date: `${endDays[0]}-${endDays[1]}-${j}`,
                        attend: attend.length,
                        late: late.length,
                        permit: permit.length,
                        leave: leave.length,
                        alpha: alpha.length
                    });
                }
                res.status(200).send({
                    status: true,
                    data
                })
            } else {
                let data = []
                for (let i = 1; i <= parseInt(my_date[2]); i++) {
                    let j
                    if (i <= 9) {
                        j = `0${i}`
                    } else {
                        j = i
                    }

                    const attend = await Attendance.find({
                        date: getDates(`${year}-${month}-${j}`, 0, "Y-m-d"),
                        status: "Attend",

                    })
                    const late = await Attendance.find({
                        date: getDates(`${year}-${month}-${j}`, 0, "Y-m-d"),
                        status: "Late"
                    })
                    const permit = await Attendance.find({
                        date: getDates(`${year}-${month}-${j}`, 0, "Y-m-d"),
                        status: "Permit"
                    })
                    const leave = await Attendance.find({
                        date: getDates(`${year}-${month}-${j}`, 0, "Y-m-d"),
                        status: "Leave"
                    })
                    const alpha = await Attendance.find({
                        date: getDates(`${year}-${month}-${j}`, 0, "Y-m-d"),
                        status: "Alpha"
                    })
                    data.push({
                        date: `${year}-${my_date[1]}-${j}`,
                        attend: attend.length,
                        late: late.length,
                        permit: permit.length,
                        leave: leave.length,
                        alpha: alpha.length
                    });
                }
                res.status(200).send({
                    status: true,
                    data
                })
            }
        } catch (error) {
            res.status(404).send({
                status: false,
                message: error.message
            })
        }

    },
    chartByStaff: async (req, res) => {
        try {
            let date = getTime(0, "Y-m-d");
            let my_date = date.split('-')
            let year = parseInt(my_date[0]);
            let month = parseInt(my_date[1]);
            let start = getDates(`${year}-${month}-1`, 0, "Y-m-d")
            let end = getDates(date, 0, "Y-m-d")
            const attend = await Attendance.find({
                id_user: req.params.userId,
                date: {
                    $gte: new Date(start),
                    $lte: new Date(end)
                },
                status: "Attend"
            })

            const late = await Attendance.find({
                id_user: req.params.userId,
                date: {
                    $gte: new Date(start),
                    $lte: new Date(end)
                },
                status: "Late"
            })

            const alpha = await Attendance.find({
                id_user: req.params.userId,
                date: {
                    $gte: new Date(start),
                    $lte: new Date(end)
                },
                status: "Alpha"
            })

            const permit = await Attendance.find({
                id_user: req.params.userId,
                date: {
                    $gte: new Date(start),
                    $lte: new Date(end)
                },
                status: "Permit"
            })

            const leave = await Attendance.find({
                id_user: req.params.userId,
                date: {
                    $gte: new Date(start),
                    $lte: new Date(end)
                },
                status: "Leave"
            })

            res.status(200).send({
                status: true,
                start_date: `${my_date[0]}-${my_date[1]}-01`,
                end_date: `${my_date[0]}-${my_date[1]}-${my_date[2]}`,
                attend: attend.length,
                late: late.length,
                alpha: alpha.length,
                permit: permit.length,
                leave: leave.length,
            })
        } catch (error) {
            res.status(400).send({
                status: false,
                message: error.message
            })
        }
    },
    ratingsbystaff: async (req, res) => {
        let date = getTime(0, "Y-m-d");
        let my_date = date.split('-')
        let year = parseInt(my_date[0]);
        let month = parseInt(my_date[1] - 1);
        let day = parseInt(my_date[2])
        let id = req.user._id
        let notWeekend = getNotSatSun(month, year);
        let start = getDates(`${year}-${month + 1}-1`, 0, "Y-m-d")
        let end = getDates(date, 0, "Y-m-d")
        let days = []
        for (let i = 0; i < notWeekend.length; i++) {
            if (notWeekend[i] <= day) {
                days.push(notWeekend[i])
            }
        }

        const user = await User.find({ _id: id }).populate({
            path: 'id_staff',
            populate: {
                path: 'id_division',
                select: 'name'
            }
        })
        const countAlphaByStaff = await Attendance.find({
            id_user: user[0]._id,
            status: 'Alpha',
            date: {
                $gte: new Date(start),
                $lte: new Date(end)
            },
        })
        const countAttendByStaff = await Attendance.find({
            id_user: user[0]._id,
            status: 'Attend',
            date: {
                $gte: new Date(start),
                $lte: new Date(end)
            },
        })
        const countPermitByStaff = await Attendance.find({
            id_user: user[0]._id,
            status: 'Permit',
            date: {
                $gte: new Date(start),
                $lte: new Date(end)
            },
        })
        const countLeaveByStaff = await Attendance.find({
            id_user: user[0]._id,
            status: 'Leave',
            date: {
                $gte: new Date(start),
                $lte: new Date(end)
            },
        })
        const countLateByStaff = await Attendance.find({
            id_user: user[0]._id,
            status: 'Late',
            date: {
                $gte: new Date(start),
                $lte: new Date(end)
            },
        })
        let persentage = ((countAttendByStaff.length * 5) + (countLeaveByStaff.length * 4) + (countPermitByStaff.length * 3) + (countLateByStaff.length * 2) + (countAlphaByStaff.length * 1)) / (days.length * 5) * 100
        let message = ''
        if (persentage == 0) {
            message = 'no ratings yet'
        } else
            if (persentage < 20) {
                message = 'your performance is not good! please improve your performance!!'
            } else
                if (persentage >= 20) {
                    message = 'improve your performance!!'
                } else
                    if (persentage >= 60) {
                        message = 'good work!! keep it up!'
                    } else
                        if (persentage >= 100) {
                            message = 'you are one of the best employees! keep it up!!'
                        }

        res.status(200).send({
            user,
            persentage: Math.round(persentage),
            message
        })
    },
    ratings: async (req, res) => {
        let date = getTime(0, "Y-m-d");
        let my_date = date.split('-')
        let year = parseInt(my_date[0]);
        let month = parseInt(my_date[1] - 1);
        let day = parseInt(my_date[2])
        let notWeekend = getNotSatSun(month, year)
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
        let start = query !== null ? getDates(`${query[0]}-${query[1]}-01`, 0, "Y-m-d") : getDates(`${year}-${month + 1}-1`, 0, "Y-m-d")
        let end = query !== null ? getDates(`${query[0]}-${query[1]}-${currentDays}`, 0, "Y-m-d") : getDates(date, 0, "Y-m-d")
        const user = await User.find().populate({
            path: 'id_staff',
            populate: {
                path: 'id_division',
                select: 'name'
            }
        })
        let days = []
        for (let i = 0; i < notWeekend.length; i++) {
            if (query !== null) {
                if (notWeekend[i]) {
                    days.push(notWeekend[i])
                }
            } else {
                if (notWeekend[i] <= day) {
                    days.push(notWeekend[i])
                }
            }
        }
        let users = []
        for (let i = 0; i < user.length; i++) {
            const countAlphaByStaff = await Attendance.find({
                id_user: user[i]._id,
                status: 'Alpha',
                date: {
                    $gte: new Date(start),
                    $lte: new Date(end)
                },
            })
            const countAttendByStaff = await Attendance.find({
                id_user: user[i]._id,
                status: 'Attend',
                date: {
                    $gte: new Date(start),
                    $lte: new Date(end)
                },
            })
            const countPermitByStaff = await Attendance.find({
                id_user: user[i]._id,
                status: 'Permit',
                date: {
                    $gte: new Date(start),
                    $lte: new Date(end)
                },
            })
            const countLeaveByStaff = await Attendance.find({
                id_user: user[i]._id,
                status: 'Leave',
                date: {
                    $gte: new Date(start),
                    $lte: new Date(end)
                },
            })
            const countLateByStaff = await Attendance.find({
                id_user: user[i]._id,
                status: 'Late',
                date: {
                    $gte: new Date(start),
                    $lte: new Date(end)
                },
            })
            let persentage = ((countAttendByStaff.length * 5) + (countLeaveByStaff.length * 4) + (countPermitByStaff.length * 3) + (countLateByStaff.length * 2) + (countAlphaByStaff.length * 1)) / (days.length * 5) * 100
            let message = ''
            if (persentage == 0) {
                message = 'no ratings yet'
            } else
                if (persentage < 20) {
                    message = 'your performance is not good! please improve your performance!!'
                } else
                    if (persentage >= 20) {
                        message = 'improve your performance!!'
                    } else
                        if (persentage >= 60) {
                            message = 'good work!! keep it up!'
                        } else
                            if (persentage >= 100) {
                                message = 'you are one of the best employees! keep it up!!'
                            }
            users.push({
                staff: user[i],
                persentage: Math.round(persentage),
                message: message
            })
        }
        try {
            if (req.user.role === 'STAFF') {
                throw Error("not allowed by the system!")
            } else {
                res.status(200).send(users)
            }
        } catch (error) {
            res.status(400).send({
                status: false,
                message: error.message
            })
        }

    },
    report: async (req, res) => {
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
        let end = query !== null ? getDates(`${query[0]}-${query[1]}-${currentDays}`, 0, "Y-m-d") : getDates(date, 0, "Y-m-d")
        //try
        const user = await User.find().populate({
            path: 'id_staff',
            populate: {
                path: 'id_division',
                select: 'name'
            }
        })
        let users = []
        for (let i = 0; i < user.length; i++) {
            const countAlphaByStaff = await Attendance.find({
                id_user: user[i]._id,
                status: 'Alpha',
                date: {
                    $gte: new Date(start),
                    $lte: new Date(end)
                },
            })
            const countAttendByStaff = await Attendance.find({
                id_user: user[i]._id,
                status: 'Attend',
                date: {
                    $gte: new Date(start),
                    $lte: new Date(end)
                },
            })
            const countPermitByStaff = await Attendance.find({
                id_user: user[i]._id,
                status: 'Permit',
                date: {
                    $gte: new Date(start),
                    $lte: new Date(end)
                },
            })
            const countLeaveByStaff = await Attendance.find({
                id_user: user[i]._id,
                status: 'Leave',
                date: {
                    $gte: new Date(start),
                    $lte: new Date(end)
                },
            })
            const countLateByStaff = await Attendance.find({
                id_user: user[i]._id,
                status: 'Late',
                date: {
                    $gte: new Date(start),
                    $lte: new Date(end)
                },
            })

            users.push({
                staff: user[i],
                attend: countAttendByStaff.length,
                alpha: countAlphaByStaff.length,
                late: countLateByStaff.length,
                permit: countPermitByStaff.length,
                leave: countLeaveByStaff.length
            })
        }
        try {
            if (req.user.role === 'STAFF') {
                throw Error("not allowed by the system!")
            } else {
                res.status(200).send(users)
            }
        } catch (error) {
            res.status(400).send({
                status: false,
                message: error.message
            })
        }
    }
}