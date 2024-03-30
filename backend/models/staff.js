const mongoose = require("mongoose")

const StaffSchema = new mongoose.Schema({
    _id: Number,
    id_division: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "division",
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    birth: {
        type: Date,
    },
    address: {
        type: String,
        required: true,
    },
    photo: {
        type: String,
    },
    NIK: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        enum: ['Laki-laki', 'Perempuan'],
    },
    area: {
        type: String,
    },
    is_deleted: {
        type: Number,
        enum: [0, 1],
        default: 0
    }
})

const Staff = mongoose.model("staff", StaffSchema)

module.exports = Staff