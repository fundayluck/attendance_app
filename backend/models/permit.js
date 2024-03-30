const { Schema, model } = require("mongoose")

const PermitSchema = new Schema({
    id_staff: {
        type: Schema.Types.ObjectId,
        ref: "user",
    },
    id_HR: {
        type: Schema.Types.ObjectId,
        ref: "user",
    },
    start_date: {
        type: Date
    },
    end_date: {
        type: Date
    },
    status: {
        type: String
    },
    proof: {
        type: String
    },
    notes_hr: {
        type: String
    },
    note: {
        type: String
    },
    is_accepted: {
        type: Number,
    }
})

const Permit = model("permit", PermitSchema)

module.exports = Permit