
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/auth');
const isAuth = require('../middleware/is-auth');

const User = require('../models/user');

router.put('/signup',[
    body('email').isEmail().withMessage('Please enter a valid email').custom((value, {req})=>{
        return User.findOne({email: value}).then(userDoc=> {
            if(userDoc){
                return Promise.reject('E-Mail address already exists!');
            }
        })
    }).normalizeEmail(),
    body('password').trim().isLength({min: 5}),
    body('name').trim().not().isEmpty()
], authController.signup);

router.post('/login', authController.login);

router.get('/status', isAuth, authController.getUserStatus);

router.post('/status', isAuth, [
    body('status').trim().not().isEmpty()
], authController.updateUserStatus)

module.exports = router;