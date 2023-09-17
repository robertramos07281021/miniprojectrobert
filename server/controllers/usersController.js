
const User = require('../../models/user');
const catchAsync = require('../../utils/catchAsync')


//render registration form
exports.registrationForm = (req,res) => {
    res.render('users/registrationForm');
}

//for registration
exports.saveNewUser = catchAsync(async (req,res) => {
    try{
        const {email, username, password} = req.body;
        const user = new User({email, username});
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, function(err) {
            if(err) {
                return next(err);
            }
            req.flash('success', 'Welcome to listing app');
            res.redirect('/listings')
        })
    } catch(e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
})

//render loginForm
exports.loginForm = (req, res) => {
    res.render('users/loginForm');
}

//for loginForm
exports.loginUser = (req,res) => {
    req.flash('success', 'Welcome Back!')
    const redirectUrl = res.locals.returnTo || '/listings';
    res.redirect(redirectUrl);
}

//for logout
exports.logout = (req,res, next) => {
    req.logout(function(err) {
        if(err){
            return next(err);
        }
        req.flash('success', 'You are now logged out');
        res.redirect('/listings')
    })
}