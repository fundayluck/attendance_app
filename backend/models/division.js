const { Schema, model } = require("mongoose")

const DivisionSchema = new Schema({
    name: {
        type: String
    }
})

const Division = model("division", DivisionSchema)

module.exports = Division