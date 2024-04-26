const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const transporter = require('../config/email');
const { userRegistrationValidation, userLoginValidation } = require('../validators/userValidation');
const { generateToken } = require('../middlewares/authMiddleware')

const userRegister = async (req, res) => {
    try {
        const userValidation = userRegistrationValidation.validate(req.body);
        if (userValidation.error) {
            return res.status(400).send({
                status: 'fail',
                message: userValidation.error.details[0].message,
            })
        }

        const { name, email, password, password_confirmation, tc } = req.body;

        const existingUser = await userModel.findOne({ email });

        if (existingUser) {
            return res.status(400).send({
                status: "fail",
                message: "Email already exists"
            })
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            name: name,
            email: email,
            password: hashPassword,
            termsAndConditions: tc

        });

        const response = await newUser.save();

        res.status(201).send({
            status: "success",
            message: "User Registered successfully",

        })

    } catch (err) {
        return res.status(500).send({
            status: 'fail',
            message: 'Unable to register user'
        })
    }

};

const userLogin = async (req, res) => {
    try {
        const userValidation = userLoginValidation.validate(req.body);
        if (userValidation.error) {
            return res.status(400).send({
                status: 'fail',
                message: userValidation.error.details[0].message,
            })
        }
        const { email, password } = req.body;
        const user = await userModel.findOne({ email: email });

        if (!user) {
            return res.status(400).send({
                status: 'fail',
                message: 'Invalid email or password'
            })
        }

        const matchPassword = await bcrypt.compare(password, user.password);
        if (!matchPassword) {
            return res.status(400).send({
                status: 'fail',
                message: 'Invalid email or password'
            })
        }

        const token = generateToken(user._id);

        res.status(200).send({
            status: "success",
            message: "User logged in  successfully",
            token: token
        });

    } catch (err) {
        res.status(500).send({
            status: "fail",
            message: "Unable to login "
        })
    }
}

const resetPassword = async (req, res) => {
    try {

        const { id, new_password, password_confirmation } = req.body;

        // Find user by ID
        const user = await userModel.findById(id);
        if (!user) {
            return res.status(404).send({
                status: 'fail',
                message: 'User not found',
            });
        }

        // Check if new_password matches password_confirmation
        if (new_password !== password_confirmation) {
            return res.status(400).send({
                status: 'fail',
                message: 'Passwords do not match',
            });
        }

        // Generate salt and hash new password
        const salt = await bcrypt.genSalt(10);
        const new_hashPassword = await bcrypt.hash(new_password, salt);

        // Update user's password
        user.password = new_hashPassword;
        await user.save();

        return res.status(200).send({
            status: "success",
            message: "Password changed successfully"
        });
    } catch (err) {
        console.error(err);
        return res.status(500).send({
            status: "fail",
            message: "Unable to reset the password"
        });
    }
};

const logggedUser = async (req, res) => {
    try {
        const id = req.params.id;
        console.log(id)

        // Fetch user details by ID
        const user = await userModel.findById(id).select('-password');

        if (!user) {
            return res.status(404).send({
                status: 'fail',
                message: 'User not found',
            });
        }

        // Return user details
        res.status(200).send({
            status: "success",
            message: "User details retrieved successfully",
            user: user
        });
    } catch (err) {
        console.error(err);
        return res.status(500).send({
            status: "fail",
            message: "Unable to fetch user details"
        });
    }
};

const sendResetPasswordEmail = async (req, res) => {
    try {
        const { email } = req.body;
        if (email) {
            const user = await userModel.findOne({ email: email });
            console.log(user)

            if (user) {
                const secret = user._id + process.env.JWT_SECRET_KEY;
                const token = generateToken(user._id);
                //link generate
                const link = `http://127.0.0.1:5000/api/user/reset/${user._id}/${token}`;
                console.log('link', link);

                //send email
                let emailOptions = await transporter.sendMail({
                    from: process.env.EMAIL_FROM,
                    to: user.email,
                    subject: "GeekShop - Password Reset Link",
                    html: `<a href =${link}> Click Here </a> to reset your password`
                })

                res.status(200).send({
                    status: "success",
                    message: "reset password mail sent successfully",
                    link: link,
                    emailOptions: emailOptions
                })

            } else {
                res.status(400).send({
                    status: "fail",
                    message: "email doesnot exists"
                })
            }
        } else {
            res.status(400).send({
                status: "fail",
                message: "email is required"
            })
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({
            status: "fail",
            message: "Unable to send reset password email "
        })
    }
}

module.exports = { userRegister, userLogin, resetPassword, logggedUser, sendResetPasswordEmail };