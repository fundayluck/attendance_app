const { Schema, model } = require("mongoose")

const configSchema = new Schema({
    start_working: {
        type: String
    },
    finish_working: {
        type: String
    },
    late: {
        type: String
    }
})

const Config = model("config", configSchema)

module.exports = Config