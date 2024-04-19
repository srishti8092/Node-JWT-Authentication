const mongoose = require('mongoose');

const connectDB = async (DB_URL) => {
    try {
        const db_options = {
            dbName: process.env.DB_NAME
        }
        await mongoose.connect(DB_URL, db_options);
        console.log(`Database connected successfully!`)
    } catch (err) {
        console.log(`Error in connecting database :`, err)
    }
}

module.exports = connectDB