const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const transporter = require('../config/email');

const userRegister = async (req, res) => {
    try {
        const { name, email, password, password_confirmation, tc } = req.body;

        const user = await userModel.findOne({ email: email });

        if (user) {
            res.status(400).send({
                status: "fail",
                message: "Email already exists"
            })
        } else {
            if (name && email && password && password_confirmation && tc) {
                if (password === password_confirmation) {
                    const salt = await bcrypt.genSalt(10);
                    const hashPassword = await bcrypt.hash(password, salt)

                    const data = new userModel({
                        name: name,
                        email: email,
                        password: hashPassword,
                        termsAndConditions: tc

                    });
                    const response = await data.save()

                    res.status(201).send({
                        status: "success",
                        message: "User Register successfully",

                    })

                } else {
                    res.status(400).send({
                        status: "fail",
                        message: "passsword does not match"
                    })
                }
            } else {
                res.status(400).send({
                    status: "fail",
                    message: "All fields are required"
                })
            }
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({
            status: 'fail',
            message: 'Unable to register user'
        })
    }

};

const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (email && password) {
            const user = await userModel.findOne({ email: email });

            if (user != null) {
                const matchPassword = await bcrypt.compare(password, user.password);
                if ((user.email === email) && matchPassword) {

                    //generate jwt token
                    const token = jwt.sign({ user_id: user._id },
                        process.env.JWT_SECRET_KEY,
                        { expiresIn: '1d' }
                    )
                    res.status(200).send({
                        status: "success",
                        message: "User login successfully",
                        token: token
                    });
                } else {
                    res.status(400).send({
                        status: "fail",
                        message: "Invalid email or password"
                    });
                }
            } else {
                res.status(400).send({
                    status: "fail",
                    message: "Invalid user"
                });
            }
        } else {
            res.status(400).send({
                status: "fail",
                message: "Invalid email and password"
            });
        }

    } catch (err) {
        console.log(err);
        res.status(500).send({
            status: "fail",
            message: "Unable to login "
        })
    }
}

const resetPassword = async (req, res) => {
    try {
        const { new_password, password_confirmation } = req.body;
        const { id, token } = req.params;

        const user = await userModel.findById(id);
        const new_secret = user._id + process.env.JWT_SECRET_KEY;

        jwt.verify(token, new_secret);

        if (new_password && password_confirmation) {

            if (new_password === password_confirmation) {
                const salt = await bcrypt.genSalt(10);
                const new_hashPassword = await bcrypt.hash(new_password, salt);

                await userModel.findByIdAndUpdate(
                    user._id,
                    {
                        $set: {
                            new_passsword: new_hashPassword
                        }
                    })

                res.status(200).send({
                    status: "success",
                    message: "password changed successfully"
                })

            } else {
                res.status(400).send({
                    status: "fail",
                    message: "password and confirm password doesnot match"
                })
            }
        } else {
            res.status(400).send({
                status: "fail",
                message: "All fields are required"
            })
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({
            status: "fail",
            message: "Unable to reset the password "
        })
    }
}

const logggedUser = async (req, res) => {
    res.status(200).send({
        status: "success",
        message: "user logged in details",
        user: req.user
    })
}

const sendResetPasswordEmail = async (req, res) => {
    try {
        const { email } = req.body;
        if (email) {
            const user = await userModel.findOne({ email: email });
            console.log(user)

            if (user) {
                const secret = user._id + process.env.JWT_SECRET_KEY;
                const token = jwt.sign({ user_id: user._id }, secret, { expiresIn: '15m' })
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