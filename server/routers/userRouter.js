const express = require('express');
const router = express.Router();
const UsersController = require('../controllers/usersController');
const passport = require('passport');
const {returnTo} = require('../../middlewares')

router.get('/register',UsersController.registrationForm);
router.post('/register', UsersController.saveNewUser);
router.get('/login',UsersController.loginForm);
router.post('/login',returnTo, passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), UsersController.loginUser);
router.get('/logout',UsersController.logout);

module.exports = router;