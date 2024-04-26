const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

const generateToken = (user_id) => {
    return jwt.sign({ user_id }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });
};

const checkUserAuth = async (req, res, next) => {
    let token;
    const { authorization } = req.headers
    if (authorization && authorization.startsWith('Bearer')) {
        try {
            token = authorization.split(' ')[1]

            // Verify Token
            const { user_id } = jwt.verify(token, process.env.JWT_SECRET_KEY)

            // Get User from Token
            req.user = await userModel.findById(user_id).select('-password')

            next();

        } catch (error) {
            console.log(error)
            res.status(401).send({
                status: "fail",
                message: "Unauthorized User"
            })
        }
    } else {
        res.status(401).send({
            status: "fail",
            message: "Token is required for authorized user"
        });
    }
}

module.exports = { checkUserAuth, generateToken }