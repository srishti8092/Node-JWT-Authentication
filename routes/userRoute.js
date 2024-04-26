const express = require('express');
const router = express.Router();
const { userRegister, userLogin, resetPassword, logggedUser, sendResetPasswordEmail } = require('../controllers/userController');
const { checkUserAuth } = require('../middlewares/authMiddleware');
//public routes
router.post('/register', userRegister);
router.post('/login', userLogin);
router.post('/reset-password-email', sendResetPasswordEmail)

//protected routes
router.post('/reset-password', resetPassword);
router.get('/logged-user/:id', logggedUser)
module.exports = router;