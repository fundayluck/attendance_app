const Staff = require('../models/staff')
const division = require('../models/division')
const User = require('../models/user')
module.exports = {
    createStaff: async (req, res) => {
        const {
            name,
            phone,
            address,
            birth,
            NIK,
            gender,
            area,
            _id,
            id_division
        } = req.body
        try {
            const findDivision = await division.findById(id_division)
            const staff = new Staff({
                _id,
                id_division: findDivision,
                name,
                phone,
                birth,
                area,
                address,
                gender,
                photo: req.file.path,
                NIK
            })
            await staff.save()
            res.status(200).send({
                status: true,
                data: staff
            })
        } catch (error) {
            if (error.code === 11000 && error.keyPattern._id === 1) {
                return res.status(400).send({
                    status: false,
                    message: 'User id already exist!'
                })
            }
            return res.status(400).send({
                status: false,
                message: error.message
            });
        }

    },
    getAllStaff: async (req, res) => {
        const staff = await Staff.find({}).populate('id_division')
        if (staff.length === 0) {
            res.status(404).send({
                status: false,
                data: 'no data available'
            })
        } else {
            res.status(200).send({
                status: true,
                data: staff
            })
        }
    },
    getStaff: async (req, res) => {
        const staff = await Staff.findOne({ _id: req.params.staffId }).populate('id_division')
        if (staff.length === 0) {
            res.status(404).send({
                status: false,
                data: 'no data available'
            })
        } else {
            res.status(200).send({
                status: true,
                data: staff
            })
        }
    },
    getStaffWithoutAccount: async (req, res) => {
        try {
            const nip = await Staff.aggregate([
                {
                    $lookup: {
                        from: "users",
                        localField: "_id",
                        foreignField: "id_staff",
                        as: "joined"
                    }
                }, {
                    $match: {
                        joined: []
                    }
                }
            ])
            const populateQuery = [
                {
                    path: 'id_division',
                    select: 'name'
                }
            ]
            await Staff.populate(nip, populateQuery)
            if (nip.length === 0) {
                res.status(404).send({
                    status: false,
                    data: 'All employees already have an account'
                })
            } else {
                res.status(200).send({
                    status: true,
                    data: nip
                })
            }
        } catch (error) {
            console.log(error);
        }
    },
    editStaff: async (req, res) => {
        const {
            name,
            phone,
            birth,
            address,
            NIK,
            gender,
            area,
            id_division
        } = req.body
        try {
            const findDivision = await division.findById(id_division)
            await Staff.updateOne({ _id: req.params.staffId },
                {
                    name,
                    id_division: findDivision,
                    phone,
                    birth,
                    address,
                    NIK,
                    gender,
                    area
                })
            res.status(200).send({
                status: true,
                message: 'Changed data is saved successfully'
            })
        } catch (error) {
            res.status(400).send({
                status: false,
                message: error.message
            })
        }
    },
    deleteUser: async (req, res) => {
        const nip = await Staff.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "id_staff",
                    as: 'user'
                }
            },
            {
                $match: {
                    _id: Number(req.params.staffId),
                }
            },
        ])
        try {
            if (nip[0].is_deleted === 1 || nip[0].user[0].is_active === 0) {
                res.status(400).send({
                    status: false,
                    message: "an error occurred because the staff already removed!"
                })
            } else {
                const updateStaff = await Staff.findOneAndUpdate(
                    { _id: nip[0]._id },
                    {
                        is_deleted: 1
                    }
                )
                const updateUser = await User.findOneAndUpdate(
                    { _id: nip[0].user[0]._id },
                    {
                        is_active: 0
                    }
                )

                await updateStaff.save()
                await updateUser.save()
                res.status(200).send({
                    status: true,
                    message: "Staff has been deleted!"
                })
            }
        } catch (error) {
            console.log(error);
        }
    }
}