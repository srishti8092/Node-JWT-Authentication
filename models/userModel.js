const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trime: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    termsAndConditions: {
        type: Boolean,
        required: true,
    }
});

const userModel = mongoose.model("user", userSchema);
module.exports = userModel;
