require("dotenv").config()
const { MONGODB_URI } = process.env
const mongoose = require('mongoose')
const config = { useNewUrlParser: true, useUnifiedTopology: true }


mongoose.set('strictQuery', false);
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(MONGODB_URI, config);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log('MongoDB not Connected');
        console.log(error);
        process.exit(1);
    }
}

module.exports = connectDB