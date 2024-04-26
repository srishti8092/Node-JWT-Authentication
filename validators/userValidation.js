const joi = require('joi');

//user register
const userRegistrationValidation = joi.object({
    name: joi.string().required(),
    email: joi.string().required(),
    password: joi.string().min(6).required(),
    password_confirmation: joi.string().valid(joi.ref('password')).required(),
    tc: joi.boolean().required(),
});

//user login
const userLoginValidation = joi.object({
    email: joi.string().required(),
    password: joi.string().min(6).required(),
})

//reset password 
const restPasswordValidation = joi.object({
    new_password: joi.string().min(6).required(),
    password_confirmation: joi.string().valid(joi.ref('password')).required(),
})

module.exports = { userRegistrationValidation, userLoginValidation, restPasswordValidation };